export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://hms_dev:hms_dev_only@127.0.0.1:5432/hms",
  },
};
