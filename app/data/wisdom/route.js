
import { API } from "@/core/config/api";

export async function WisdomReq({ page, size }) {
  const page = page || 0;
  const size = size || 100;

  const listReq = await fetch(`${API().core}wisdom?page=${page}&size=${size}`);
  const list = await listReq.json();


  return list;
}
