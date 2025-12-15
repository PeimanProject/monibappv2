"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const getSSRToken = async () => {
  const session = await getIronSession(await cookies(), {
    password: process.env.AUTH_SECRET,
    cookieName: process.env.AUTH_TOKEN,
  });

  return session?.token;
};


export const getSSRAppRole = async () => {
  const session = await getIronSession(await cookies(), {
    password: process.env.AUTH_SECRET,
    cookieName: process.env.AUTH_TOKEN,
  });
  return session;
};