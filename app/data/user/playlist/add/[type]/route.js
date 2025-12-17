import { API } from "@/core/config/api";

export async function AddUserPlayListByType({ type, playlistIds, lectureId, token }) {

  const response = await fetch(`${API().core}user/playList/${type}`, {
    method: "PUT",
    body: JSON.stringify({ playlistIds, lectureId }),
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return { error: "not-valid" }
  const data = await response.json()


  return data;
}
