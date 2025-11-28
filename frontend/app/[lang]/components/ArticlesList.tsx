"use client";
import Image from "next/image";
import Link from "next/link";
import { useArticles } from "../hooks/useArticles";
import { formatDate, getStrapiMedia } from "../utils/api-helpers";
import Loader from "./Loader";

const ArticlesList = () => {
  const { data, isLoading, loadMore, hasMore, error } = useArticles();
  if (isLoading && data.length === 0) return <Loader />;

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }
  return (
    <section className="container p-6 mx-auto space-y-6 sm:space-y-12">
      <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data &&
          data.map((article) => {
            const imageUrl = getStrapiMedia(article?.cover?.url || null);

            const category = article?.category;
            const authorsBio = article?.authorsBio;

            const avatarUrl = getStrapiMedia(authorsBio?.avatar?.url || null);

            return (
              <Link
                href={`${category?.slug}/${article?.slug}`}
                key={article.id}
                className="max-w-sm mx-auto group hover:no-underline focus:no-underline bg-white border border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:border-gray-600 lg:w-[300px] xl:min-w-[375px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {imageUrl && (
                  <Image
                    alt="presentation"
                    width="240"
                    height="240"
                    className="object-cover w-full h-44 "
                    src={imageUrl}
                    unoptimized={true}
                  />
                )}
                <div className="p-6 space-y-2 relative">
                  {avatarUrl && (
                    <Image
                      alt="avatar"
                      width="80"
                      height="80"
                      src={avatarUrl}
                      unoptimized={true}
                      className="rounded-full h-16 w-16 object-cover absolute -top-8 right-4"
                    />
                  )}

                  <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline text-gray-900 dark:text-gray-100">
                    {article.title}
                  </h3>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(article.publishedAt)}
                    </span>
                    {authorsBio && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {authorsBio.name}
                      </span>
                    )}
                  </div>
                  <p className="py-4 text-gray-700 dark:text-gray-300">
                    {article.description}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            className="px-6 py-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load more posts..."}
          </button>
        </div>
      )}
    </section>
  );
};

export default ArticlesList;
