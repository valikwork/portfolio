#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";

interface StrapiAttribute {
  type: string;
  component?: string;
  repeatable?: boolean;
  multiple?: boolean;
  required?: boolean;
  allowedTypes?: string[];
  relation?: string;
  target?: string;
  inversedBy?: string;
  mappedBy?: string;
}

interface StrapiSchema {
  kind: "singleType" | "collectionType";
  collectionName: string;
  info: {
    singularName: string;
    pluralName: string;
    displayName: string;
  };
  attributes: Record<string, StrapiAttribute>;
}

interface ComponentSchema {
  info: {
    displayName: string;
  };
  attributes: Record<string, StrapiAttribute>;
}

class StrapiTypeGenerator {
  private backendPath: string;
  private outputPath: string;
  private generatedInterfaces: Set<string> = new Set();

  constructor(backendPath: string, outputPath: string) {
    this.backendPath = backendPath;
    this.outputPath = outputPath;
  }

  /**
   * Convert Strapi attribute type to TypeScript type
   */
  private convertAttributeType(attribute: StrapiAttribute): string {
    switch (attribute.type) {
      case "string":
      case "text":
      case "richtext":
      case "email":
      case "password":
      case "uid":
        return "string";

      case "integer":
      case "biginteger":
      case "float":
      case "decimal":
        return "number";

      case "boolean":
        return "boolean";

      case "date":
      case "datetime":
      case "time":
        return "string"; // ISO string format

      case "json":
        return "Record<string, any>";

      case "enumeration":
        return "string"; // Could be enhanced to generate union types

      case "media":
        return attribute.multiple ? "StrapiMedia[]" : "StrapiMedia";

      case "relation":
        if (attribute.target) {
          const targetName = this.formatInterfaceName(attribute.target);
          if (
            attribute.relation === "oneToMany" ||
            attribute.relation === "manyToMany"
          ) {
            return `StrapiCollection<${targetName}>`;
          }
          return `StrapiRelation<${targetName}>`;
        }
        return "any";

      case "component":
        if (attribute.component) {
          const componentName = this.formatComponentName(attribute.component);
          return attribute.repeatable ? `${componentName}[]` : componentName;
        }
        return "any";

      case "dynamiczone":
        return "any[]"; // Could be enhanced for specific dynamic zone types

      default:
        console.warn(`Unknown attribute type: ${attribute.type}`);
        return "any";
    }
  }

  /**
   * Format API name to interface name
   * api::article.article -> Article
   * api::lead-form-submission.lead-form-submission -> LeadFormSubmission
   */
  private formatInterfaceName(apiName: string): string {
    if (apiName.startsWith("api::")) {
      const parts = apiName.split(".");
      const name = parts[parts.length - 1];
      return this.toPascalCase(name);
    }
    return this.toPascalCase(apiName);
  }

  /**
   * Format component name to interface name
   * layout.navbar -> LayoutNavbar
   * links.social-link -> LinksSocialLink
   */
  private formatComponentName(componentName: string): string {
    return componentName
      .split(".")
      .map((part) => this.toPascalCase(part))
      .join("");
  }

  /**
   * Convert kebab-case or snake_case to PascalCase
   * social-link -> SocialLink
   * user_profile -> UserProfile
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word) => this.capitalize(word))
      .join("");
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate interface for a content type or component
   */
  private generateInterface(
    name: string,
    attributes: Record<string, StrapiAttribute>,
    isComponent = false
  ): string {
    const interfaceName = isComponent
      ? this.formatComponentName(name)
      : this.formatInterfaceName(name);

    if (this.generatedInterfaces.has(interfaceName)) {
      return ""; // Already generated
    }

    this.generatedInterfaces.add(interfaceName);

    let interfaceCode = `export interface ${interfaceName} {\n`;

    for (const [attrName, attribute] of Object.entries(attributes)) {
      const tsType = this.convertAttributeType(attribute);
      const optional = !attribute.required ? "?" : "";

      interfaceCode += `  ${attrName}${optional}: ${tsType};\n`;
    }

    interfaceCode += "}\n\n";

    return interfaceCode;
  }

  /**
   * Scan and parse all schema files
   */
  private async scanSchemas(): Promise<{
    contentTypes: Record<string, StrapiSchema>;
    components: Record<string, ComponentSchema>;
  }> {
    const contentTypes: Record<string, StrapiSchema> = {};
    const components: Record<string, ComponentSchema> = {};

    // Scan API content types
    const apiPath = path.join(this.backendPath, "src/api");
    if (fs.existsSync(apiPath)) {
      const apiDirs = fs.readdirSync(apiPath);

      for (const dir of apiDirs) {
        const schemaPath = path.join(
          apiPath,
          dir,
          "content-types",
          dir,
          "schema.json"
        );
        if (fs.existsSync(schemaPath)) {
          try {
            const schema: StrapiSchema = JSON.parse(
              fs.readFileSync(schemaPath, "utf-8")
            );
            contentTypes[`api::${dir}.${dir}`] = schema;
          } catch (error) {
            console.warn(`Failed to parse schema: ${schemaPath}`, error);
          }
        }
      }
    }

    // Scan components
    const componentsPath = path.join(this.backendPath, "src/components");
    if (fs.existsSync(componentsPath)) {
      const componentDirs = fs.readdirSync(componentsPath);

      for (const categoryDir of componentDirs) {
        const categoryPath = path.join(componentsPath, categoryDir);
        if (fs.statSync(categoryPath).isDirectory()) {
          const componentFiles = fs.readdirSync(categoryPath);

          for (const file of componentFiles) {
            if (file.endsWith(".json")) {
              const componentPath = path.join(categoryPath, file);
              try {
                const component: ComponentSchema = JSON.parse(
                  fs.readFileSync(componentPath, "utf-8")
                );
                const componentName = `${categoryDir}.${file.replace(
                  ".json",
                  ""
                )}`;
                components[componentName] = component;
              } catch (error) {
                console.warn(
                  `Failed to parse component: ${componentPath}`,
                  error
                );
              }
            }
          }
        }
      }
    }

    return { contentTypes, components };
  }

  /**
   * Generate base Strapi types
   */
  private generateBaseStrapiTypes(): string {
    return `// Base Strapi types
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width: number;
  height: number;
  formats?: {
    [key: string]: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type StrapiRelation<T> = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
} & T;

export type StrapiCollection<T> = Array<{
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
} & T>;

export interface StrapiResponse<T> {
  data: T | null;
  error?: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

export interface StrapiCollectionResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  error?: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

// Specific response types for single types
export interface StrapiSingleTypeResponse<T> {
  data: ({
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
  } & T) | null;
  meta?: Record<string, any>;
  error?: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

`;
  }

  /**
   * Generate all types from schemas
   */
  public async generateTypes(): Promise<void> {
    console.log("🔍 Scanning Strapi schemas...");

    const { contentTypes, components } = await this.scanSchemas();

    console.log(`📦 Found ${Object.keys(contentTypes).length} content types`);
    console.log(`🧩 Found ${Object.keys(components).length} components`);

    let generatedCode = `// Auto-generated Strapi types
// Generated on: ${new Date().toISOString()}
// Do not edit this file manually

`;

    // Add base types
    generatedCode += this.generateBaseStrapiTypes();

    // Generate component interfaces first (dependencies)
    console.log("🧩 Generating component interfaces...");
    for (const [name, component] of Object.entries(components)) {
      generatedCode += this.generateInterface(name, component.attributes, true);
    }

    // Generate content type interfaces
    console.log("📝 Generating content type interfaces...");
    for (const [name, schema] of Object.entries(contentTypes)) {
      generatedCode += this.generateInterface(name, schema.attributes, false);
    }

    // Generate specific response types for known content types
    generatedCode += "// Specific response types\n";
    for (const [name, schema] of Object.entries(contentTypes)) {
      const interfaceName = this.formatInterfaceName(name);
      const responseTypeName = `${interfaceName}Response`;

      if (schema.kind === "singleType") {
        generatedCode += `export type ${responseTypeName} = StrapiSingleTypeResponse<${interfaceName}>;\n`;
      } else {
        generatedCode += `export type ${responseTypeName} = StrapiCollectionResponse<${interfaceName}>;\n`;
        generatedCode += `export type ${interfaceName}SingleResponse = StrapiResponse<${interfaceName}>;\n`;
      }
    }

    // Ensure output directory exists
    const outputDir = path.dirname(this.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write generated types
    fs.writeFileSync(this.outputPath, generatedCode);

    console.log(`✅ Generated types written to: ${this.outputPath}`);
    console.log(`📊 Generated ${this.generatedInterfaces.size} interfaces`);
  }
}

// CLI usage
if (require.main === module) {
  const backendPath = process.argv[2] || path.join(process.cwd(), "../backend");
  const outputPath =
    process.argv[3] ||
    path.join(process.cwd(), "app/[lang]/types/generated-strapi.ts");

  const generator = new StrapiTypeGenerator(backendPath, outputPath);

  generator.generateTypes().catch((error) => {
    console.error("❌ Error generating types:", error);
    process.exit(1);
  });
}

export { StrapiTypeGenerator };
