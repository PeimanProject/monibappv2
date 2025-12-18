import { API } from "@/core/config/api";

export async function DownloadReq({ lectureId, type = "sound" }) {

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

  return fileUrl;
}
