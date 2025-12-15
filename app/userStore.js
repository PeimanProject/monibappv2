"use client";

import React, { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export const UserStore = ({ user }) => {
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(user);
  }, [user]);

  return <></>;
};
