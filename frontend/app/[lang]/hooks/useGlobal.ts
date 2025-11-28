import { useCallback, useEffect, useState } from "react";
import { Global, GlobalResponse } from "../types/generated-strapi";
import { fetchAPI } from "../utils/fetch-api";

interface UseGlobalOptions {
  populate?: string[];
  initialLoad?: boolean;
}

interface UseGlobalReturn {
  data: Global | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const DEFAULT_POPULATE = [
  "metadata",
  "favicon",
  "hero_section",
  "hero_section.selfPortrait",
  "notificationBanner",
  "navbar.links",
  "navbar.button",
  "navbar.navbarLogo.logoImg",
  "footer.footerLogo.logoImg",
  "footer.menuLinks",
  "footer.legalLinks",
  "footer.socialLinks",
  "footer.categories",
];

export function useGlobal(options: UseGlobalOptions = {}): UseGlobalReturn {
  const { populate = DEFAULT_POPULATE, initialLoad = true } = options;

  const [data, setData] = useState<Global | null>(null);
  const [isLoading, setLoading] = useState(initialLoad);
  const [error, setError] = useState<Error | null>(null);

  const fetchGlobal = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

      if (!token) {
        throw new Error(
          "The Strapi API Token environment variable is not set."
        );
      }

      const path = `/global`;
      const urlParamsObject = { populate };
      const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

      const response: GlobalResponse = await fetchAPI(
        path,
        urlParamsObject,
        fetchOptions
      );

      setData(response.data || null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch global data");
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [populate]);

  const refetch = useCallback(async () => {
    await fetchGlobal();
  }, [fetchGlobal]);

  useEffect(() => {
    if (initialLoad) {
      fetchGlobal();
    }
  }, [fetchGlobal, initialLoad]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
