import { BlockRenderer } from "@/app/[lang]/components/BlockRenderer";
import {
  Project,
  ProjectSingleResponse,
} from "@/app/[lang]/types/generated-strapi";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import { formatDateFull } from "@/app/[lang]/utils/date-format";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: {
    project: string;
    lang: string;
  };
}

async function getProjectBySlug(slug: string): Promise<Project | null> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/projects`;
  const urlParamsObject = {
    filters: { slug },
    populate: {
      cover: { fields: ["url", "alternativeText", "width", "height"] },
      icon: { fields: ["url", "alternativeText", "width", "height"] },
    },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const response: ProjectSingleResponse = await fetchAPI(
    path,
    urlParamsObject,
    options,
  );

  return response.data &&
    Array.isArray(response.data) &&
    response.data.length > 0
    ? response.data[0]
    : null;
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.project);

  if (!project) {
    notFound();
  }

  const coverImage = getStrapiMedia(project.cover?.url || null);
  const iconImage = getStrapiMedia(project.icon?.url || null);

  return (
    <div>
      {/* Hero Section with Cover Image */}
      {coverImage && (
        <div className="relative w-full md:h-[500px] hidden md:block">
          <Image
            src={coverImage}
            alt={project.cover?.alternativeText || `${project.title} cover`}
            fill
            className="object-contain object-center"
            priority
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col max-w-4xl mx-auto px-6 relative z-10 ${
          coverImage ? "md:-mt-20" : "pt-12"
        }`}
      >
        {/* Project Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Project Icon */}
            {iconImage && (
              <div className="flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-3 flex items-center justify-center">
                  <Image
                    src={iconImage}
                    alt={
                      project.icon?.alternativeText || `${project.title} icon`
                    }
                    width={96}
                    height={96}
                    className="max-w-full max-h-full object-contain"
                    unoptimized={true}
                  />
                </div>
              </div>
            )}

            {/* Project Title */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {project.title}
              </h1>

              {/* Description */}
              {project.description && (
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-6">
                  <BlockRenderer content={project.description} />
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                {project.linkToApp && (
                  <a
                    href={project.linkToApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Check it out
                  </a>
                )}

                {project.linkToRepo && (
                  <a
                    href={project.linkToRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Description */}
        {project.fullDescription && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              About the Project
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <BlockRenderer content={project.fullDescription} />
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-semibold">Published:</span>{" "}
              {formatDateFull(project.publishedAt)}
            </div>
            {project.updatedAt !== project.createdAt && (
              <div>
                <span className="font-semibold">Updated:</span>{" "}
                {formatDateFull(project.updatedAt)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
