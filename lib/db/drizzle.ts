// lib/drizzle.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variable
const postgresUrl = process.env.POSTGRES_URL;
if (!postgresUrl) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

// Configure PostgreSQL client with production-ready settings
const client = postgres(postgresUrl, {
  max: 20, // Maximum number of connections
  idle_timeout: 30, // Close idle connections after 30 seconds
  connect_timeout: 30, // Timeout for connection attempts
  prepare: false, // Disable prepared statements for better performance with PgBouncer
});

// Create Drizzle instance with proper typing
export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development", // Enable query logging in development
});

// Export types for easy access
export type DbClient = typeof db;
export type Schema = typeof schema;

// Explicitly export all tables from your schema
export const { users, teams, teamMembers, activityLogs, invitations } = schema;

// Connection health check utility
export async function checkDatabaseConnection() {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}

export type { User } from "./schema";

// Cleanup function for proper shutdown
export async function closeConnection() {
  await client.end();
}
