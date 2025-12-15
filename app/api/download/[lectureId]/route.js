"use server";

import { API } from "@/core/config/api";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { lectureId } = await params;
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "sound";

  const req = await fetch(`${API().core}content/lecture/${lectureId}`);
  const lecture = await req.json();

 // const fileUrl = lecture[type]?.url;
  const fileUrl = lecture.download[type];

  // const response = await fetch(fileUrl);
  // const fileBuffer = await response.arrayBuffer();

  // return new NextResponse(fileBuffer, {
  //   status: 200,
  //   headers: {
  //     "Content-Type": "audio/mpeg",
  //     "Content-Disposition": `attachment; filename=${encodeURIComponent(lecture?.title).replace(/%20/g, ' ')}.mp3`,
  //   },
  // });

  return NextResponse.redirect(fileUrl);
}
