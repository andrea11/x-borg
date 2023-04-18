import HttpStatusCodes from "~/constants/HttpStatusCodes";
import { api } from "@/contracts";
import { authService } from "./AuthService";
import { initServer } from "@ts-rest/express";
import { userService } from "../user/UserService";

const s = initServer();

export default s.router(api.auth, {
  login: async ({ body: { signature } }) => {
    const signingAddress = authService.login(signature)

    if (!signingAddress) {
      return {
        status: HttpStatusCodes.UNAUTHORIZED,
        body: {
          errors: [{ message: "Invalid signature" }]
        }
      }
    }

    const user = await userService.getUser(signingAddress)

    if (user) {
      return {
        status: HttpStatusCodes.OK,
        body: {}
      }
    }

    await userService.createUser(signingAddress)

    return {
      status: HttpStatusCodes.CREATED,
      body: {}
    }
  }
});