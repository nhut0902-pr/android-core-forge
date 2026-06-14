import { createServerFn } from "@tanstack/start";

export const verifyAdminCredentials = createServerFn({ method: "POST" })
  .validator((data: any) => {
    if (typeof data.username !== "string" || typeof data.password !== "string") {
      throw new Error("Invalid credentials format");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const adminUser = process.env.ADMIN_USERNAME || "nhutcoderteam0902pr";
    const adminPass = process.env.ADMIN_PASSWORD || "090211";

    if (data.username === adminUser && data.password === adminPass) {
      return { success: true };
    }

    return { success: false };
  });
