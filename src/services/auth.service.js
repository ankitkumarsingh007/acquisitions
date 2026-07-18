import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing the password: ${e}`);
    const error = new Error('Error Hashing');
    error.cause = e;
    throw error;
  }
};

// Compare a plain text password with a hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (e) {
    logger.error(`Error comparing passwords: ${e}`);
    const error = new Error('Error comparing passwords');
    error.cause = e;
    throw error;
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser && existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: passwordHash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating the user: ${e}`);
    const error = new Error('Error creating the user');
    error.cause = e;
    throw error;
  }
};

// Authenticate a user by email and password
export const authenticateUser = async (email, password) => {
  try {
    const usersResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!usersResult || usersResult.length === 0) {
      throw new Error('User not found');
    }

    const user = usersResult[0];
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    return user;
  } catch (e) {
    logger.error(`Error authenticating user: ${e}`);
    const error = new Error('Error authenticating user');
    error.cause = e;
    throw error;
  }
};
