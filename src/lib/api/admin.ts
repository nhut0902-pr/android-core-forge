import { createServerFn } from "@tanstack/react-start";

export const verifyAdminCredentials = createServerFn({ method: "POST" })
  .validator((data: any) => {
    if (typeof data.username !== "string" || typeof data.password !== "string") {
      throw new Error("Invalid credentials format");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      console.error("ADMIN_USERNAME or ADMIN_PASSWORD not set in environment");
      return { success: false };
    }

    if (data.username === adminUser && data.password === adminPass) {
      return { success: true };
    }

    return { success: false };
  });
