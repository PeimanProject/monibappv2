
import { API } from "@/core/config/api";

export async function LectureReq(body) {

  const response = await fetch(`${API().core}content/lectures`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
    },
  });
  if (!response.ok) return { error: "not-valid" }
  const data = await response.json()

  return data;
}
