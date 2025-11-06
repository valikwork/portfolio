/**
 * `page-populate-middleware` middleware
 */

import type { Core } from "@strapi/strapi";
import type { Context, Next } from "koa";

interface PopulateConfig {
  contentSections: {
    populate: {
      picture: {
        fields: string[];
      };
      buttons: {
        populate: boolean;
      };
      feature: {
        populate: {
          fields: string[];
          media: {
            fields: string[];
          };
        };
      };
      testimonials: {
        populate: {
          picture: {
            fields: string[];
          };
        };
      };
      plans: {
        populate: string[];
      };
      submitButton: {
        populate: boolean;
      };
    };
  };
}

const populate: PopulateConfig = {
  contentSections: {
    populate: {
      picture: {
        fields: ["url", "alternativeText", "caption", "width", "height"],
      },
      buttons: {
        populate: true,
      },
      feature: {
        populate: {
          fields: ["title", "description", "showLink", "newTab", "url", "text"],
          media: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
        },
      },
      testimonials: {
        populate: {
          picture: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
        },
      },
      plans: {
        populate: ["product_features"],
      },
      submitButton: {
        populate: true,
      },
    },
  },
};

interface MiddlewareConfig {
  // Add any middleware configuration properties here
}

interface MiddlewareContext extends Context {
  query: {
    populate?: PopulateConfig;
    filters?: {
      slug?: string;
    };
    locale?: string;
  };
}

export default (
  config: MiddlewareConfig,
  { strapi }: { strapi: Core.Strapi }
) => {
  return async (ctx: MiddlewareContext, next: Next): Promise<void> => {
    ctx.query = {
      populate,
      filters: { slug: ctx.query.filters?.slug },
      locale: ctx.query.locale,
    };

    console.log("page-populate-middleware.ts: ctx.query = ", ctx.query);

    await next();
  };
};
