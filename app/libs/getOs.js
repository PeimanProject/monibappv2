import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const GetOs = async () => {
  const { get } = await headers();
  const ua = get("user-agent");

  return new UAParser(ua || "").getOS().name;
};
