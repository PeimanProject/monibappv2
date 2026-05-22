"use client";
import React from "react";
import { Box } from "@mui/material";
import { MobileAppShell } from "@/app/component/appShell/MobileAppShell";
import { MainAppBar } from "@/app/fragment/appBar/mainAppBar";
import { MobileTopBar } from "@/app/fragment/appBar/mobileTopBar";
import { AuthLoginControl } from "@/app/fragment/auth/authLoginControl";
import { MyPlayListControl } from "@/app/fragment/playlist/myPlayListControl";
import { ProfileControl } from "@/app/fragment/auth/profileControl";
import { SelectMyPlayListControl } from "@/app/fragment/playlist/selectMyPlayListControl";
import { PlayerAction } from "@/app/fragment/player/playerAction";
import { NetworkStatusBanner } from "../component/connectivityView";

const PublicLayout = ({ children }) => {
  const viewport = "mobile";

  return (
    <>
      <MyPlayListControl />
      <SelectMyPlayListControl />
      <AuthLoginControl />
      <PlayerAction />
      <ProfileControl />
      <MobileAppShell
        header={
          <>
            <MobileTopBar />
            <NetworkStatusBanner />
          </>
        }
        footer={<MainAppBar viewport={viewport} />}
      >
        {children}
      </MobileAppShell>
    </>
  );
};

export default PublicLayout;
