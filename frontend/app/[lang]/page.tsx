"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "./utils/fetch-api";

import ArticlesList from "./components/ArticlesList";
import Loader from "./components/Loader";
import PageHeader from "./components/PageHeader";
import {
  Article,
  ArticleResponse,
  StrapiCollectionMeta,
} from "./types/generated-strapi";

const Profile = () => {
  const [meta, setMeta] = useState<StrapiCollectionMeta | null>();
  const [data, setData] = useState<Article[] | null>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = useCallback(async (start: number, limit: number) => {
    setLoading(true);
    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const path = `/articles`;
      const urlParamsObject = {
        sort: { createdAt: "desc" },
        populate: {
          cover: { fields: ["url"] },
          category: { populate: "*" },
          authorsBio: {
            populate: "*",
          },
        },
        pagination: {
          start: start,
          limit: limit,
        },
      };
      const options = { headers: { Authorization: `Bearer ${token}` } };
      const responseData: ArticleResponse = await fetchAPI(
        path,
        urlParamsObject,
        options
      );

      if (start === 0) {
        setData(responseData.data);
      } else {
        setData((prevData) => [
          ...(prevData || []),
          ...(responseData.data || []),
        ]);
      }

      setMeta(responseData.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  function loadMorePosts(): void {
    const nextPosts = meta!.pagination.start + meta!.pagination.limit;
    fetchData(nextPosts, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
  }

  useEffect(() => {
    fetchData(0, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
  }, [fetchData]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader heading="Our Blog" text="Checkout Something Cool" />
      <ArticlesList data={data}>
        {meta!.pagination.start + meta!.pagination.limit <
          meta!.pagination.total && (
          <div className="flex justify-center">
            <button
              type="button"
              className="px-6 py-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-gray-600 transition-colors"
              onClick={loadMorePosts}
            >
              Load more posts...
            </button>
          </div>
        )}
      </ArticlesList>
    </div>
  );
};

export default Profile;
