import { useCallback, useEffect, useState } from "react";
import {
  Job,
  JobResponse,
  StrapiCollectionMeta,
} from "../types/generated-strapi";
import { fetchAPI } from "../utils/fetch-api";

interface UseArticlesOptions {
  pageLimit?: number;
  initialLoad?: boolean;
}

interface UseJobsReturn {
  data: Job[];
  meta: StrapiCollectionMeta | null;
  isLoading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const DEFAULT_PAGE_LIMIT = 10;

export function useJobs(options: UseArticlesOptions = {}): UseJobsReturn {
  const {
    pageLimit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) ||
      DEFAULT_PAGE_LIMIT,
    initialLoad = true,
  } = options;

  const [data, setData] = useState<Job[]>([]);
  const [meta, setMeta] = useState<StrapiCollectionMeta | null>(null);
  const [isLoading, setLoading] = useState(initialLoad);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = useCallback(async (start: number, limit: number) => {
    setLoading(true);
    setError(null);

    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const path = `/jobs`;
      const urlParamsObject = {
        sort: { createdAt: "desc" },
        populate: {
          icon: { fields: ["url"] },
          category: { populate: "*" },
          authorsBio: {
            populate: "*",
          },
        },
        pagination: {
          start,
          limit,
        },
      };
      const options = { headers: { Authorization: `Bearer ${token}` } };

      const responseData: JobResponse = await fetchAPI(
        path,
        urlParamsObject,
        options
      );

      if (start === 0) {
        setData(responseData.data || []);
      } else {
        setData((prevData) => [...prevData, ...(responseData.data || [])]);
      }

      setMeta(responseData.meta || null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch articles");
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!meta || isLoading) return;

    const nextStart = meta.pagination.start + meta.pagination.limit;
    await fetchJobs(nextStart, pageLimit);
  }, [meta, isLoading, fetchJobs, pageLimit]);

  const hasMore =
    meta !== null &&
    meta.pagination.start + meta.pagination.limit < meta.pagination.total;

  useEffect(() => {
    if (initialLoad) {
      fetchJobs(0, pageLimit);
    }
  }, [fetchJobs, pageLimit, initialLoad]);

  return {
    data,
    meta,
    isLoading,
    error,
    loadMore,
    hasMore,
  };
}
