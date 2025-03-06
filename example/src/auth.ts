import NextAuth from "next-auth";
// Import mongodb authjs adapter
import { MongoDBAdapter } from "@auth/mongodb-adapter";
// Import mongodb client
import mongoClient from "./lib/mongoDB";
// Import redis client
import redisClient from "./lib/redis";
// Import custom db adapter
import { customDBAdapter } from "./lib/customDBAdapater";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Initialize adapter
  adapter: customDBAdapter(
    MongoDBAdapter(mongoClient, {
      databaseName: "knotblaze",
    }),
    redisClient
  ),
});
