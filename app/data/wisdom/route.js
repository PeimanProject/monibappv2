"use server";

import { API } from "@/core/config/api";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 0;
  const size = searchParams.get("size") || 100;

  const listReq = await fetch(`${API().core}wisdom?page=${page}&size=${size}`);
  const list = await listReq.json();

  const xResponse = NextResponse.json(list, {
    status: 200,
    headers: { "content-type": "application/json" },
  });

  return xResponse;
}
