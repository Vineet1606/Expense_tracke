/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://neondb_owner:aHWvJ8bRqn6k@ep-young-hill-a521rzto.us-east-2.aws.neon.tech/Exp_track?sslmode=require",
    }
  };