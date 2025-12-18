
import { API } from "@/core/config/api";

export async function WisdomReq({ page, size }) {
  const p = page || 0;
  const s = size || 100;

  const listReq = await fetch(`${API().core}wisdom?page=${p}&size=${s}`);
  const list = await listReq.json();


  return list;
}
