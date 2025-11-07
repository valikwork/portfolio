import type { Metadata } from "next";
import "./globals.css";
import type { GlobalResponse } from "./types/generated-strapi";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";

import { i18n } from "../../i18n-config";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";

const FALLBACK_SEO = {
  title: "Strapi Starter Next Blog",
  description: "Strapi Starter Next Blog",
};

const getGlobal = async (): Promise<GlobalResponse> => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token)
    throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      "favicon",
      "navbar.links",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
      "footer.menuLinks",
      "footer.legalLinks",
      "footer.socialLinks",
      "footer.categories",
    ],
  };

  const response = await fetchAPI(path, urlParamsObject, options);

  return response;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const meta = await getGlobal();

  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data;

  if (!favicon) return FALLBACK_SEO;

  const { url } = favicon;

  return {
    title: metadata?.metaTitle,
    description: metadata?.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
  };
};

const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) => {
  const resolvedParams = await params;
  const global = await getGlobal();
  // TODO: CREATE A CUSTOM ERROR PAGE

  if (!global.data) return null;

  const { navbar, footer } = global.data;

  const navbarLogoUrl = getStrapiMedia(
    navbar?.navbarLogo?.logoImg?.url || null
  );

  const footerLogoUrl = getStrapiMedia(
    footer?.footerLogo?.logoImg?.url || null
  );

  return (
    <html lang={resolvedParams.lang}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {navbar && (
            <Navbar
              links={navbar.links ?? []}
              logoUrl={navbarLogoUrl}
              logoText={navbar?.navbarLogo?.logoText ?? null}
            />
          )}

          <main className="min-h-screen">{children}</main>

          {footer && (
            <Footer
              logoUrl={footerLogoUrl}
              logoText={footer?.footerLogo?.logoText ?? null}
              menuLinks={footer.menuLinks || []}
              categoryLinks={footer.categories || []}
              legalLinks={footer.legalLinks || []}
              socialLinks={footer.socialLinks || []}
            />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export const generateStaticParams = async () => {
  return i18n.locales.map((locale) => ({ lang: locale }));
};
