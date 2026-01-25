"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { useGlobal } from "../hooks/useGlobal";
import { LinksLink } from "../types/generated-strapi";
import { getStrapiMedia } from "../utils/api-helpers";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const NavLink = ({
  url,
  text,
  isMobile,
  onClick,
}: LinksLink & { isMobile?: boolean; onClick?: () => void }) => {
  const path = usePathname();
  const [copied, setCopied] = useState(false);

  // Extract lang from pathname (e.g., /en/... -> en)
  const lang = path.split("/")[1];

  // Check if it's an external link (http://, https://, mailto:, tel:, etc.)
  const isExternal = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
  const absoluteUrl =
    isExternal || url.startsWith("/")
      ? url
      : `/${lang}${url.startsWith("/") ? url : `/${url}`}`;

  // Check if it's a mailto link and extract email
  const isMailto = url.startsWith("mailto:");
  const emailAddress = isMailto ? url.split("mailto:")[1]?.split("?")[0] : "";

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <li className="flex relative group items-center justify-between">
      <Link
        href={absoluteUrl}
        className={
          isMobile
            ? "block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            : `flex items-center mx-4 -mb-1 hover:text-violet-600 dark:hover:text-violet-400 ${
                path === absoluteUrl && "text-violet-600 dark:text-violet-400"
              }}`
        }
        onClick={onClick}
      >
        {text}
      </Link>

      {isMailto && (
        <>
          {copied ? (
            <div className="md:absolute md:top-full md:left-1/2 md:transform md:-translate-x-1/2 md:mt-1 p-2 bg-green-500 text-white text-xs rounded whitespace-nowrap z-50">
              Copied to clipboard!
            </div>
          ) : (
            <div
              onClick={copyToClipboard}
              className="md:hidden group-hover:block md:absolute md:top-full md:left-1/2 md:transform md:-translate-x-1/2 md:mt-1 p-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-40 cursor-pointer hover:bg-gray-700"
            >
              <FaCopy className="inline mr-1" />
              {emailAddress}
            </div>
          )}
        </>
      )}
    </li>
  );
};

const Navbar = () => {
  const { data, isLoading } = useGlobal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  const navbarLogoUrl = getStrapiMedia(
    data?.navbar?.navbarLogo?.logoImg?.url || null,
  );

  const logoText = data?.navbar?.navbarLogo?.logoText ?? null;
  const links = data?.navbar?.links || [];

  return (
    <div className="p-4">
      <div className="container flex justify-between items-center h-16 mx-auto px-0 sm:px-6">
        <div>
          <Link href="/">
            {navbarLogoUrl && <Logo src={navbarLogoUrl}></Logo>}
            {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
          </Link>
        </div>

        <div className="items-center flex-shrink-0 hidden lg:flex">
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <ul className="items-stretch hidden space-x-3 lg:flex">
              {links.map((item: LinksLink) => (
                <NavLink key={item.url} {...item} />
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center lg:hidden space-x-2">
          <ThemeToggle />
          <button
            className="p-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700 dark:text-gray-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700 dark:text-gray-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
          <ul className="flex flex-col space-y-2 p-4">
            {links.map((item: LinksLink) => (
              <NavLink
                key={item.url}
                {...item}
                isMobile={true}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
