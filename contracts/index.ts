import { initContract } from "@ts-rest/core";
import { user } from "@/contracts/user";
import { auth } from "@/contracts/auth";

const c = initContract();

export const api = c.router({
  user,
  auth,
})