import type { Metadata } from "next";
import type { GlobalResponse } from "./types/generated-strapi";
import { getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";

import { i18n } from "../../i18n-config";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";

const FALLBACK_SEO = {
  title: "Strapi Starter Next Blog",
  description: "Strapi Starter Next Blog",
};

const getMeta = async (): Promise<GlobalResponse> => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token)
    throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: ["metadata", "favicon"],
  };

  const response = await fetchAPI(path, urlParamsObject, options);

  return response;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const meta = await getMeta();

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
  // TODO: CREATE A CUSTOM ERROR PAGE
  return (
    <html lang={resolvedParams.lang}>
      <head>
        <meta
          name="google-site-verification"
          content="5KxQBuzkD6edh8Mc-7Dug-ymlAoiioTFT4bdlxgp_iU"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export const generateStaticParams = async () => {
  return i18n.locales.map((locale) => ({ lang: locale }));
};
