import HttpStatusCodes from "~/constants/HttpStatusCodes";
import { api } from "@/contracts";
import { authService } from "../auth/AuthService";
import { userService } from "./UserService";
import { initServer } from "@ts-rest/express";

const s = initServer();

export default s.router(api.user, {
  getUser: async ({ req, params: { signingAddress } }) => {
    const signature = (req.cookies as Record<string, string>)["AUTH_TOKEN"]
    if (!signature || !authService.login(signature)) {
      return {
        status: HttpStatusCodes.UNAUTHORIZED,
        body: {
          errors: [{ message: "Unauthorized. Please login" }],
        }
      }
    }

    const user = await userService.getUser(signingAddress)

    if (!user) {
      return {
        status: HttpStatusCodes.NOT_FOUND,
        body: {
          errors: [{ message: "User not found" }],
        }
      }
    }

    return {
      status: HttpStatusCodes.OK,
      body: {
        ...user,
      }
    }
  }
});