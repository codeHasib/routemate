import { betterAuth } from "better-auth";
import { jwt, role } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(`${process.env.DB_URI}`);
const db = client.db("routemate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        defaultValue: "user",
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
