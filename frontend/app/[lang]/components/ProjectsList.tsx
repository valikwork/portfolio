"use client";
import { BlockRenderer } from "@/app/[lang]/components/BlockRenderer";
import Image from "next/image";
import Link from "next/link";
import { useProjects } from "../hooks/useProjects";
import { getStrapiMedia } from "../utils/api-helpers";
import Loader from "./Loader";

const ProjectsList = () => {
  const { data, isLoading, loadMore, hasMore, error } = useProjects();

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
          <h3 className=" text-3xl font-bold mb-4">Projects</h3>
          <p className="">Some open things I&apos;ve worked on.</p>
        </div>
        {data &&
          data.map((project) => {
            const coverImage = getStrapiMedia(project.cover?.url || null);

            return (
              <div
                key={project.id}
                className="group bg-white border border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {coverImage && (
                  <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
                    <Image
                      alt={`${project.title} cover`}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      src={coverImage}
                      unoptimized={true}
                    />
                  </div>
                )}
                <div className="p-6 space-y-4">
                  <Link href={`projects/${project?.slug}`}>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:underline">
                      {project.title}
                    </h3>
                  </Link>
                  <div className="text-gray-700 dark:text-gray-300">
                    <BlockRenderer content={project.description} />
                  </div>
                  <div className="flex gap-4">
                    {project.linkToApp && (
                      <a
                        href={project.linkToApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Check it out
                      </a>
                    )}
                    {project.linkToRepo && (
                      <a
                        href={project.linkToRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block text-gray-700 dark:text-gray-300 hover:underline font-medium"
                      >
                        View Repo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            className="text-gray-900 dark:text-gray-100 cursor-pointer px-6 py-3 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ProjectsList;
