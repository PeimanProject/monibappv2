import { API, getHeaders } from "@/core/config/api";

export async function SearchReq(body) {

  const listReq = await fetch(`${API().core}search/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const list = await listReq.json();

  return list
}
