import { initQueryClient } from "@ts-rest/react-query";
import { api } from "@/contracts";
import { env } from "@/env.mjs";

export const client = initQueryClient(api, {
  baseUrl: env.NEXT_PUBLIC_API_URL_ENTRYPOINT,
  baseHeaders: {
    "Content-Type": "application/json",
  },
  credentials: "include",
})