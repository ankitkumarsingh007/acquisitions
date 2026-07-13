import 'dotenv/config';

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};

// The purpose of this configuration file is to provide the necessary settings for Drizzle ORM (Object-Relational Mapping) to connect to
//  a PostgreSQL database. It specifies the schema location, output directory for generated files, the database dialect, and the credentials required
// to establish a connection to the database. The connection string is retrieved from an environment variable (DATABASE_URL) for security and flexibility.
