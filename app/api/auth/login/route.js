"use server";

import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { API } from "@/core/config/api";

export async function POST(req) {
  const body = await req.json();

  const response = await fetch(`${API().security}/appLogin/`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      AppName: "monib_core_panel",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!!result?.token) {
    const { profile, access, isAdmin, sa, app_role } = result;
    const response = NextResponse.json({
      profile,
      access,
      isAdmin,
      sa,
      app_role,
    });
    const session = await getIronSession(await cookies(), {
      password: process.env.AUTH_SECRET,
      cookieName: process.env.AUTH_TOKEN,
    });

    session.token = result?.token;
    await session.save();

    return response;
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
