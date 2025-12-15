"use server";

import { API } from "@/core/config/api";
import { NextResponse } from "next/server";
import { getSSRToken } from "@/core/ssrToken";

export async function GET() {
  const response = await fetch(`${API().core}user/playList/`, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${await getSSRToken()}`,
    },
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

export async function POST(request) {
  const { title } = await request.json();

  const response = await fetch(`${API().core}user/playList/`, {
    method: "POST",
    body: JSON.stringify({ title }),
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${await getSSRToken()}`,
    },
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

export async function PUT(request) {
  const { title, id } = await request.json();

  const response = await fetch(`${API().core}user/playList/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${await getSSRToken()}`,
    },
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

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const response = await fetch(`${API().core}user/playList/${id}`, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${await getSSRToken()}`,
    },
  });

  const status = response.status;

  const xResponse = NextResponse.json(
    status === 200 ? {} : { error: "not-valid" },
    {
      status: status,
      headers: { "content-type": "application/json" },
    }
  );

  return xResponse;
}
