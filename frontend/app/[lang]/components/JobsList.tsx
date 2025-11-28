"use client";
import { BlockRenderer } from "@/app/[lang]/components/BlockRenderer";
import Image from "next/image";
import Link from "next/link";
import { useJobs } from "../hooks/useJobs";
import { getStrapiMedia } from "../utils/api-helpers";
import { formatMonthYear, timeDuration } from "../utils/date-format";
import Loader from "./Loader";

const JobsList = () => {
  const { data, isLoading, loadMore, hasMore, error } = useJobs();

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
    <section className="max-w-4xl p-6 mx-auto space-y-6 sm:space-y-12">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className=" text-3xl font-bold mb-4">Background & experience</h3>
          <p className="">
            Companies and projects I&apos;ve worked for over the years.
          </p>
        </div>
        {data &&
          data.map((job) => {
            const category = job?.category;

            const companyLogo = getStrapiMedia(job.icon?.url || null);

            return (
              <Link
                href={`${category?.slug}/${job?.slug}`}
                key={job.id}
                className="group hover:no-underline focus:no-underline bg-white border border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="p-6 space-y-2 relative">
                  <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline text-gray-900 dark:text-gray-100">
                    {job.jobTitle} @ {job.company} -{" "}
                    {job.fullTime ? "Full-time" : "Part-time"}
                  </h3>
                  {companyLogo && (
                    <div className="absolute top-5 right-3">
                      <Image
                        alt={`${job.company} logo`}
                        width={100}
                        height={40}
                        className="max-h-[50px] w-auto"
                        src={companyLogo}
                        unoptimized={true}
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatMonthYear(job.start)}
                      {job.finish
                        ? ` - ${formatMonthYear(job.finish)}`
                        : " - Present"}
                      {job.finish &&
                        ` (${timeDuration(job.start, job.finish)})`}
                    </span>
                  </div>
                  <div className="py-4 text-gray-700 dark:text-gray-300">
                    <BlockRenderer content={job.description} />
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            className="cursor-pointer px-6 py-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load more..."}
          </button>
        </div>
      )}
    </section>
  );
};

export default JobsList;
