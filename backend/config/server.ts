export default ({ env }) => ({
  // host: env("HOST", "0.0.0.0"),
  // port: env.int("PORT", 1337),
  url: "https://grounded-star-1867245af7.strapiapp.com/",
  app: {
    keys: env.array("APP_KEYS"),
  },
});
