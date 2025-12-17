"use server";

import { API, getHeaders } from "@/core/config/api";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  const listReq = await fetch(`${API().core}search/`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  const list = await listReq.json();

  return NextResponse.json(list, {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
