import { authService } from "./auth";
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/contracts";
import { userService } from "~/api/user/user";
import { z } from "zod";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let signature: string
  try {
    const parsedRequest = await request.json() as z.infer<typeof api.auth.login.body>;
    ({ signature } = api.auth.login.body.parse(parsedRequest))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const signingAddress = authService.login(signature)

  if (!signingAddress) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const user = await userService.getUser(signingAddress)

  const status = user ? 200 : 201

  if (!user) {
    await userService.createUser(signingAddress)
  }

  const response = NextResponse.json({}, { status })
  response.cookies.set("AUTH_TOKEN", signature)
  return response
}