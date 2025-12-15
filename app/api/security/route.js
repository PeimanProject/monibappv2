"use server";

import { API } from "@/core/config/api";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  const response = await fetch(`${API().security}code/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const status = response.status;
  const xResponse = NextResponse.json(
    status === 200 ? await response.json() : { error: "not-valid" },
    {
      status: status,
      headers: { "content-type": "application/json" },
    }
  );

  return xResponse;
}
