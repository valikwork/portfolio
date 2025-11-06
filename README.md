# 🚀 Portfolio Project

A modern full-stack portfolio website built with Next.js and Strapi, featuring a headless CMS architecture for dynamic content management and a responsive frontend.

## 📋 Overview

This portfolio project consists of two main applications:

- **Frontend**: A modern React-based web application built with Next.js
- **Backend**: A headless CMS powered by Strapi for content management

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: React 19, React Icons
- **Content**: React Markdown with GitHub Flavored Markdown support
- **Internationalization**: Custom i18n implementation with negotiator
- **Code Quality**: ESLint with Next.js and TypeScript configurations

### Backend

- **CMS**: [Strapi 5.30.1](https://strapi.io/) - Headless CMS
- **Language**: TypeScript
- **Database**: Better SQLite3
- **Runtime**: Node.js (18-22.x)
- **Authentication**: Strapi Users & Permissions plugin

### Content Types

- **Jobs**: Career/work experience entries
- **Posts**: Blog posts or articles

## 🏗️ Project Structure

```
portfolio/
├── frontend/           # Next.js application
│   ├── app/           # App Router pages and layouts
│   ├── public/        # Static assets
│   └── middleware.ts  # Next.js middleware for i18n
└── backend/           # Strapi CMS
    ├── src/           # Strapi source code
    │   ├── api/       # API endpoints (jobs, posts)
    │   └── admin/     # Admin panel configuration
    ├── config/        # Strapi configuration
    └── database/      # Database and migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js (18.x - 22.x)
- npm or yarn

### Backend Setup (Strapi)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Access the Strapi admin panel at `http://localhost:1337/admin`

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## 🔧 Development

### Backend Commands

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build the admin panel
- `npm run start` - Start production server

### Frontend Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Content Management**: Easy content editing through Strapi admin
- **TypeScript**: Full type safety across both frontend and backend
- **Modern React**: Latest React 19 features and Next.js App Router
- **Internationalization**: Built-in i18n support
- **SEO Optimized**: Next.js optimizations for search engines
- **Performance**: Optimized images, fonts, and code splitting

## 🎯 Purpose

This portfolio website serves as:

- A showcase of technical skills and experience
- A platform for sharing blog posts and articles
- A demonstration of modern web development practices
- A content management solution for easy updates

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Next.js and Strapi
