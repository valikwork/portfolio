import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valentyn Front-end Developer",
  description:
    "Valentyn is a skilled front-end dev that is eager to learn and grow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children; // просто рендер children, locale layout обгорне своїм html/body
}
