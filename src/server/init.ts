import { createServerFn } from "@tanstack/react-start";
import { seedDatabase } from "./seed";

// This runs once on the server to seed the database
let initialized = false;

export const initServer = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!initialized) {
      await seedDatabase();
      initialized = true;
    }
    return { ready: true };
  });
