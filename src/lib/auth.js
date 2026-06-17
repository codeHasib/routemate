import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(`${process.env.DB_URI}`);
const db = client.db("routemate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    fields: {
      role: {
        type: "string",
        defaultValue: "user",
        // CRITICAL FIX: Explicitly map the MongoDB document attribute name key
        dbField: "role",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwt()],
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    cookieCache: {
      enabled: true,
    },
  },
});
