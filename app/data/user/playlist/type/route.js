import { API } from "@/core/config/api";


export async function DeleteUserPlayListByType({ type, body, token }) {
  const response = await fetch(`${API().core}user/playList/${type}`, {
    method: "DELETE",
    body: JSON.stringify(body),
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return { error: "not-valid" }
  return {};
}
