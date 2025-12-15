"use server";

import { API } from "@/core/config/api";
import { NextResponse } from "next/server";
import { getSSRToken } from "@/core/ssrToken";


export async function DELETE(request,{params}) {
  const { type } =await params;
  const pr = await request.json();

  const response = await fetch(`${API().core}user/playList/${type}`, {
    method: "DELETE",
    body: JSON.stringify(pr),
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
