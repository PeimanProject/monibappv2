
import { API, getHeaders } from "@/core/config/api";

export async function ContactReq(body) {


  const listReq = await fetch(`${API().core}support/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const list = await listReq.json();

  return list
}
