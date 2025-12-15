"use server";

import { API } from "@/core/config/api";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  const response = await fetch(`${API().security}appCode/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "apiCode": "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      "AppName": "monibWebApp",
    },
  });


  const status = response.status;
  const xResponse = NextResponse.json(
    await response.json(),
    {
      status: status,
      headers: { "content-type": "application/json" },
    }
  );

  return xResponse;
}
