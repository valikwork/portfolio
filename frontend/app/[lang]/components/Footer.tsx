"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { FaDiscord, FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";
import { FaBluesky } from "react-icons/fa6";

import { useGlobal } from "../hooks/useGlobal";
import {
  Category,
  LinksLink,
  LinksSocialLink,
} from "../types/generated-strapi";
import { getStrapiMedia } from "../utils/api-helpers";

const FooterLink = ({ url, text }: LinksLink) => {
  const path = usePathname();

  // Extract lang from pathname (e.g., /en/... -> en)
  const lang = path.split("/")[1];

  const absoluteUrl = url.startsWith("/")
    ? `/${lang}${url}`
    : `/${lang}/${url}`;
  return (
    <li className="flex">
      <Link
        href={absoluteUrl}
        className={`text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 ${
          path === absoluteUrl && "text-violet-600 dark:text-violet-400"
        }}`}
      >
        {text}
      </Link>
    </li>
  );
};

const CategoryLink = (attributes: Category) => {
  const path = usePathname();

  // Extract lang from pathname (e.g., /en/... -> en)
  const lang = path.split("/")[1];

  return (
    <li className="flex">
      <Link
        href={`/${lang}/${attributes.slug}`}
        className="text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400"
      >
        {attributes.name}
      </Link>
    </li>
  );
};

const RenderSocialIcon = ({ social }: { social: string | undefined }) => {
  switch (social) {
    case "WEBSITE":
      return <CgWebsite />;
    case "TWITTER":
      return <AiFillTwitterCircle />;
    case "YOUTUBE":
      return <AiFillYoutube />;
    case "DISCORD":
      return <FaDiscord />;
    case "GITHUB":
      return <FaGithub />;
    case "BSKY":
      return <FaBluesky />;
    case "LINKEDIN":
      return <FaLinkedin />;
    case "TELEGRAM":
      return <FaTelegram />;
    default:
      return null;
  }
};

const Footer = () => {
  const { data, isLoading, error } = useGlobal();

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return null;

  const footerLogoUrl = getStrapiMedia(
    data?.footer?.footerLogo?.logoImg?.url || null,
  );

  const logoText = data?.footer?.footerLogo?.logoText ?? null;
  const menuLinks = data?.footer?.menuLinks || [];
  const categoryLinks = data?.footer?.categories || [];
  const legalLinks = data?.footer?.legalLinks || [];
  const socialLinks = data?.footer?.socialLinks || [];

  return (
    <footer className="mt-6 py-6 bg-gray-50 text-gray-900 border-t border-gray-200 dark:bg-black dark:text-gray-50 dark:border-gray-800">
      <div className="container px-6 mx-auto space-y-6 divide-y divide-gray-300 dark:divide-gray-600 md:space-y-12 divide-opacity-50">
        <div className="grid grid-cols-12 mb-4">
          {/* <div className="pb-6 col-span-full md:pb-0 md:col-span-6">
            <Logo src={footerLogoUrl}>
              {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
            </Logo>
          </div> */}

          {categoryLinks.length > 0 && (
            <div className="pb-6 col-span-6 text-left md:col-span-3">
              <p className="pb-1 text-lg font-medium text-gray-800 dark:text-gray-200">
                Categories
              </p>
              <ul>
                {categoryLinks.map((link: Category) => (
                  <CategoryLink key={link.slug} {...link} />
                ))}
              </ul>
            </div>
          )}

          <div className="pb-6 col-span-6 text-left md:col-span-3">
            <p className="pb-1 text-lg font-medium text-gray-800 dark:text-gray-200">
              Menu
            </p>
            <ul className="flex gap-4">
              {menuLinks.map((link: LinksLink) => (
                <FooterLink key={link.url} {...link} />
              ))}
            </ul>
          </div>
        </div>
        <div className="grid justify-center items-center pt-6 lg:justify-between">
          <div className="flex">
            <span className="mr-2 text-gray-600 dark:text-gray-400">
              ©{new Date().getFullYear()} All rights reserved
            </span>
            <ul className="flex">
              {legalLinks.map((link: LinksLink) => (
                <Link
                  href={link.url}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2"
                  key={link.url}
                >
                  {link.text}
                </Link>
              ))}
            </ul>
          </div>
          <div className="flex justify-center pt-4 space-x-4 lg:pt-0 lg:col-end-13">
            {socialLinks.map((link: LinksSocialLink) => {
              return (
                <a
                  key={link.url}
                  rel="noopener noreferrer"
                  href={link.url}
                  title={link.text}
                  target={link.newTab ? "_blank" : "_self"}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-500 text-white hover:bg-violet-600 dark:bg-violet-400 dark:text-gray-900 dark:hover:bg-violet-300"
                >
                  <RenderSocialIcon social={link.social} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
