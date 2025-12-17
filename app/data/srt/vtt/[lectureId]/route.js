"use server";

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { lectureId } = await params;
    const url = new URL(request.url);
    const filename = url.searchParams.get("filename");

    const response = await fetch(
      `https://bundles.monibapp.ir/srt_vtt/${lectureId}/?filename=${filename}`,
      {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          AppName: "monib_ai",
        },
      }
    );

    let data = await response.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": "attachment; filename=example.vtt",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { err },
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
