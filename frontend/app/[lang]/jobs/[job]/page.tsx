import { BlockRenderer } from "@/app/[lang]/components/BlockRenderer";
import { Job, JobSingleResponse } from "@/app/[lang]/types/generated-strapi";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import {
  formatDateFull,
  formatMonthYear,
  timeDuration,
} from "@/app/[lang]/utils/date-format";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import Image from "next/image";
import { notFound } from "next/navigation";

interface JobPageProps {
  params: {
    job: string;
    lang: string;
  };
}

async function getJobBySlug(slug: string): Promise<Job | null> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/jobs`;
  const urlParamsObject = {
    filters: { slug },
    populate: {
      cover: { fields: ["url", "alternativeText", "width", "height"] },
      icon: { fields: ["url", "alternativeText", "width", "height"] },
      category: { populate: "*" },
      authorsBio: { populate: "*" },
      blocks: { populate: "*" },
      seo: { populate: "*" },
    },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const response: JobSingleResponse = await fetchAPI(
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

const JobPage = async ({ params }: JobPageProps) => {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.job);

  if (!job) {
    notFound();
  }

  const coverImage = getStrapiMedia(job.cover?.url || null);
  const companyIcon = getStrapiMedia(job.icon?.url || null);
  const duration = job.finish
    ? timeDuration(job.start, job.finish)
    : timeDuration(job.start, new Date().toISOString());

  return (
    <div>
      {/* Hero Section with Cover Image */}
      {coverImage && (
        <div className="relative w-full md:h-[500px] hidden md:block">
          <Image
            src={coverImage}
            alt={job.cover?.alternativeText || `${job.company} cover`}
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
        {/* Job Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Company Icon */}
            {companyIcon && (
              <div className="flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-3 flex items-center justify-center">
                  <Image
                    src={companyIcon}
                    alt={job.icon?.alternativeText || `${job.company} logo`}
                    width={96}
                    height={96}
                    className="max-w-full max-h-full object-contain"
                    unoptimized={true}
                  />
                </div>
              </div>
            )}

            {/* Job Title and Meta */}
            <div className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-3">
                {job.category && (
                  <span className="inline-block px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium">
                    {job.category.name}
                  </span>
                )}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    job.fullTime
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {job.fullTime ? "Full-time" : "Part-time"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {job.jobTitle}
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                {job.company}
              </p>

              {/* Timeline */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">
                    {formatMonthYear(job.start)}
                    {job.finish
                      ? ` - ${formatMonthYear(job.finish)}`
                      : " - Present"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">{duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            About the Role
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {job.fullDescription && (
              <BlockRenderer content={job.fullDescription} />
            )}
          </div>
        </div>

        {/* Blocks Section */}
        {job.blocks && job.blocks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              Additional Information
            </h2>
            <div className="space-y-6">
              {job.blocks.map((block, index) => (
                <div key={index} className="text-gray-700 dark:text-gray-300">
                  {typeof block === "object" && block !== null && (
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(block, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {job.authorsBio && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              About the Author
            </h2>
            <div className="flex items-center gap-4">
              {job.authorsBio.avatar && (
                <Image
                  src={getStrapiMedia(job.authorsBio.avatar.url) || ""}
                  alt={job.authorsBio.name || "Author"}
                  width={64}
                  height={64}
                  className="rounded-full object-cover aspect-square"
                  unoptimized={true}
                />
              )}
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {job.authorsBio.name}
                </p>
                {job.authorsBio.email && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {job.authorsBio.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-semibold">Published:</span>{" "}
              {formatDateFull(job.publishedAt)}
            </div>
            {job.updatedAt !== job.createdAt && (
              <div>
                <span className="font-semibold">Updated:</span>{" "}
                {formatDateFull(job.updatedAt)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
