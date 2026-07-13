import 'dotenv/config';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };

// Till now the process is first we import the necessary modules and configure the environment variables using 'dotenv/config'.
//  Then, we create a connection to the Neon database using the 'neon' function and the DATABASE_URL from the environment variables.
// Finally, we initialize the Drizzle ORM with the Neon connection and export both the 'db' and 'sql' objects for use in other parts of the application.

// Why we need both drizzle and neon?
// We need both Drizzle and Neon because they serve different purposes in our application.
// Neon is a serverless database platform that allows us to connect to our database using a simple connection string (DATABASE_URL).
//  It provides the underlying database connection and handles the communication with the database server.
// Drizzle, on the other hand, is an Object-Relational Mapping (ORM) library that provides a higher-level abstraction for interacting with the database.
// In simple terms, Neon handles the connection to the database, while Drizzle provides a convenient way to work with the data in the database using JavaScript objects and methods.
