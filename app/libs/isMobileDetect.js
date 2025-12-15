"use server";

import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const getViewport = async () => {
  if (typeof process === "undefined") {
    throw new Error(
      "[Server method] you are importing a server-only module outside of server"
    );
  }

  const { get } = await headers();
  const ua = get("user-agent");

  const device = new UAParser(ua || "").getDevice();

  return device.type === "mobile"
    ? "mobile"
    : "desktop";
};
