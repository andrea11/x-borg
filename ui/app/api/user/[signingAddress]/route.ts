import { userService } from "../user";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authService } from "~/api/auth/auth";

type Context = {
  params: {
    signingAddress: string
  }
}

export async function GET(request: NextRequest, { params }: Context): Promise<NextResponse> {
  const signature = request.cookies.get("AUTH_TOKEN")

  if (!signature || !authService.login(signature.value)) {
    return NextResponse.json({
      errors: [{ message: "Unauthorized. Please login" }],
    }, { status: 401 })
  }

  const user = await userService.getUser(params.signingAddress)

  if (!user) {
    return NextResponse.json({
      errors: [{ message: "User not found" }],
    }, { status: 404 })
  }

  return NextResponse.json({
    ...user
  }, { status: 200 })
}