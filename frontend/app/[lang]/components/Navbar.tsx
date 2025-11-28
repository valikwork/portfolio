"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobal } from "../hooks/useGlobal";
import { LinksLink } from "../types/generated-strapi";
import { getStrapiMedia } from "../utils/api-helpers";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const NavLink = ({ url, text }: LinksLink) => {
  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={url}
        className={`flex items-center mx-4 -mb-1 hover:text-violet-600 dark:hover:text-violet-400 ${
          path === url && "text-violet-600 dark:text-violet-400"
        }}`}
      >
        {text}
      </Link>
    </li>
  );
};

const Navbar = () => {
  const { data, isLoading, error } = useGlobal();

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return null;

  const navbarLogoUrl = getStrapiMedia(
    data.navbar?.navbarLogo?.logoImg?.url || null
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
          <button className="p-4">
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
