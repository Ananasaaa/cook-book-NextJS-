import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";

import { signInSchema } from "../../../../schema/zod";
import { getUserFromDb } from "../../../../utils/user";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const { email, password } = await signInSchema.parseAsync(body);

    const user = await getUserFromDb(email);

    if (!user || !user.password) {
      return NextResponse.json({ code: "USER_NOT_FOUND" as const });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ code: "INVALID_CREDENTIALS" as const });
    }

    return NextResponse.json({ code: "OK" as const });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ code: "INVALID_INPUT" as const }, { status: 400 });
    }

    return NextResponse.json({ code: "SERVER_ERROR" as const }, { status: 500 });
  }
}
