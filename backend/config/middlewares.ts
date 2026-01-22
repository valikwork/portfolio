export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
          "media-src": ["'self'", "data:", "blob:", "https:"],
          "frame-ancestors": [
            "'self'",
            "http://localhost:*",
            "https://*.vercel.app",
            "https://*.railway.app",
          ],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://portfolio-production-6f83.up.railway.app",
        "https://valikwork.vercel.app",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      headers: ["Content-Type", "Authorization", "Origin", "Accept"],
      keepHeaderOnError: true,
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
