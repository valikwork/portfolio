"use client";

const PostsList = () => {
  return (
    <section className="max-w-4xl p-6 mx-auto space-y-6 sm:space-y-12">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-3xl font-bold mb-4">Articles & Posts</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Insights, tutorials, and thoughts I&apos;ve shared.
          </p>
        </div>

        {/* Placeholder cards */}
        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Coming Soon
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    No posts available yet
                  </span>
                </div>
                <div className="py-4 text-gray-700 dark:text-gray-300">
                  <p>
                    Posts will be available here soon. Stay tuned for articles,
                    tutorials, and insights.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostsList;
