"use server";

import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function POST() {
  const session = await getIronSession(await cookies(), {
    password: process.env.AUTH_SECRET,
    cookieName: process.env.AUTH_TOKEN,
  });

  session.destroy();

  return NextResponse.json({}, { status: 200 });
}
