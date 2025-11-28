"use client";
import Image from "next/image";
import { useGlobal } from "../hooks/useGlobal";
import { getStrapiMedia } from "../utils/api-helpers";
import MarqueeLine from "./MarqueeLine";

interface BlockNode {
  type: string;
  children?: Array<{ type: string; text: string }>;
  level?: number;
}

const HeroSection = () => {
  const { data } = useGlobal();
  const { hero_section } = data || {};
  const { selfPortrait, introduction, moto, selfDescription } =
    hero_section || {};
  console.log("hero_section", hero_section);
  const imageUrl = getStrapiMedia(selfPortrait?.url || null);
  console.log("imageUrl", imageUrl);

  // Helper to render blocks content
  const renderBlocks = (blocks: BlockNode[]) => {
    return blocks.map((block, index) => {
      if (block.type === "paragraph") {
        return (
          <p key={index} className="text-lg leading-relaxed">
            {block.children?.map((child, childIndex) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </p>
        );
      }
      if (block.type === "heading") {
        const level = block.level || 2;
        const headingClasses = "text-2xl font-bold mt-4 mb-2";
        const content = block.children?.map((child, childIndex) => (
          <span key={childIndex}>{child.text}</span>
        ));

        switch (level) {
          case 1:
            return (
              <h1 key={index} className={headingClasses}>
                {content}
              </h1>
            );
          case 2:
            return (
              <h2 key={index} className={headingClasses}>
                {content}
              </h2>
            );
          case 3:
            return (
              <h3 key={index} className={headingClasses}>
                {content}
              </h3>
            );
          case 4:
            return (
              <h4 key={index} className={headingClasses}>
                {content}
              </h4>
            );
          default:
            return (
              <h2 key={index} className={headingClasses}>
                {content}
              </h2>
            );
        }
      }
      return null;
    });
  };

  return (
    <section className="relative py-10 overflow-hidden">
      <MarqueeLine />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-block">
                <span className="px-4 py-2 bg-violet-100 dark:bg-violet-900/30 dark:text-white rounded-full text-2xl font-semibold">
                  {introduction}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl dark:text-white lg:text-6xl font-bold font-heading leading-tight">
                {moto}
              </h1>

              {selfDescription && (
                <div className="space-y-4 max-w-2xl dark:text-white">
                  {renderBlocks(selfDescription)}
                </div>
              )}
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {imageUrl && (
                  <div className="w-full h-full rounded-4xl overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={selfPortrait?.alternativeText || "Hero portrait"}
                      fill
                      className="object-cover object-[50%_30%] rounded-4xl"
                      priority
                      unoptimized={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
