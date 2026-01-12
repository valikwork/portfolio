import qs from "qs";
import { getStrapiURL } from "./api-helpers";

interface FetchAPIOptions {
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Fetch data from Strapi API with caching
 * @param path - API endpoint path (e.g., '/global')
 * @param urlParamsObject - Query parameters object
 * @param options - Fetch options including cache settings
 *
 * Cache options:
 * - revalidate: 3600 (1 hour) - for data that rarely changes (global settings)
 * - revalidate: 60 (1 minute) - for dynamic content
 * - revalidate: false - never revalidate (ISR)
 * - cache: 'no-store' - disable caching for real-time data
 */
export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options: FetchAPIOptions = {}
) {
  try {
    // Default cache settings - 1 hour for global data
    const defaultCacheSettings =
      path === "/global"
        ? { revalidate: 3600 } // 1 hour for global settings
        : { revalidate: 60 }; // 1 minute for other content

    // Merge default and user options
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
      next: {
        ...defaultCacheSettings,
        ...(options.next || {}),
      },
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`
    )}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Please check if your server is running and you set all the required tokens.`
    );
  }
}
