
import { API } from "@/core/config/api";

export async function SendCode(body) {

  const response = await fetch(`${API().security}appCode/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "apiCode": "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      "AppName": "monibWebApp",
    },
  });

  const res = await response.json()
  return {
    res
  };
}
