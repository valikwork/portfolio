import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n } from "./i18n-config";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Get languages from Accept-Language header
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales: string[] = [...i18n.locales];

  // Filter out invalid locales and handle empty array
  const validLanguages = languages.filter((lang) => {
    try {
      Intl.getCanonicalLocales(lang);
      return true;
    } catch {
      return false;
    }
  });

  // If no valid languages, return default locale
  if (validLanguages.length === 0) {
    return i18n.defaultLocale;
  }

  try {
    return matchLocale(validLanguages, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignore static files
  if (
    ["/manifest.json", "/favicon.ico"].includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Fix: handle root path properly
    const pathWithoutLeadingSlash = pathname.startsWith("/")
      ? pathname.slice(1)
      : pathname;

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathWithoutLeadingSlash ? `/${pathWithoutLeadingSlash}` : ""}`,
        request.url,
      ),
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
