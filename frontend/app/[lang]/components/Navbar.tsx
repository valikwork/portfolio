"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinksLink } from "../types/generated-strapi";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const NavLink = ({ url, text }: LinksLink) => {
  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={url}
        className={`flex items-center mx-4 -mb-1 border-b-2 border-transparent hover:border-gray-300 text-gray-700 hover:text-violet-600 dark:border-transparent dark:text-gray-100 dark:hover:text-violet-400 ${
          path === url &&
          "text-violet-600 border-violet-600 dark:text-violet-400 dark:border-violet-400"
        }}`}
      >
        {text}
      </Link>
    </li>
  );
};

const Navbar = ({
  links,
  logoUrl,
  logoText,
}: {
  links: LinksLink[];
  logoUrl: string | null;
  logoText: string | null;
}) => {
  return (
    <div className="p-4 border-b border-gray-200 text-gray-900 dark:border-gray-800 dark:text-gray-100">
      <div className="container flex justify-between h-16 mx-auto px-0 sm:px-6">
        <Logo src={logoUrl}>
          {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
        </Logo>

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
