import { Metadata } from "next";
import type { GlobalResponse } from "../types/generated-strapi";
import { getStrapiMedia } from "../utils/api-helpers";
import { fetchAPI } from "../utils/fetch-api";

const FALLBACK_TITLE = "CV | Portfolio";

const getCVData = async (): Promise<GlobalResponse> => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token)
    throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: ["cv", "metadata"],
  };

  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await getCVData();

  if (!data.data) {
    return { title: FALLBACK_TITLE };
  }

  const { metadata } = data.data;

  return {
    title: `CV | ${metadata?.metaTitle || "Portfolio"}`,
    description:
      metadata?.metaDescription || "View and download my curriculum vitae",
  };
};

const CVPage = async () => {
  const data = await getCVData();

  if (!data.data?.cv) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">CV Not Available</h1>
          <p className="text-gray-600 dark:text-gray-400">
            The CV file is currently not available. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  const cvUrl = getStrapiMedia(data.data.cv.url);
  const cvName = data.data.cv.name;
  const isPDF = data.data.cv.mime === "application/pdf";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Full Picture</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            View my professional background and experience in details
          </p>
          <a
            href={cvUrl || ""}
            download={cvName}
            className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Download CV
          </a>
        </div>

        {isPDF && cvUrl && (
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <object
              data={cvUrl}
              type="application/pdf"
              className="w-full h-[800px]"
            >
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  PDF preview is not available in your browser.
                </p>
                <a
                  href={cvUrl}
                  download={cvName}
                  className="text-violet-600 hover:text-violet-700 underline"
                >
                  Download CV to view
                </a>
              </div>
            </object>
          </div>
        )}

        {!isPDF && cvUrl && (
          <div className="text-center p-8 border border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Preview not available for this file type. Please download to view.
            </p>
            <a
              href={cvUrl}
              download={cvName}
              className="text-violet-600 hover:text-violet-700 underline"
            >
              Download {cvName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVPage;
