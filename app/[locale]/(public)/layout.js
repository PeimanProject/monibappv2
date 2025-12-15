import React from "react";
import { getViewport } from "@/app/libs/isMobileDetect";
import { MainAppBar } from "@/app/fragment/appBar/mainAppBar";
import { MobileTopBar } from "@/app/fragment/appBar/mobileTopBar";
import { AuthLoginControl } from "@/app/fragment/auth/authLoginControl";
import { MyPlayListControl } from "@/app/fragment/playlist/myPlayListControl";
import { ProfileControl } from "@/app/fragment/auth/profileControl";
import { SelectMyPlayListControl } from "@/app/fragment/playlist/selectMyPlayListControl";
import { PlayerAction } from "@/app/fragment/player/playerAction";

const PublicLayout = async ({ children }) => {
  const viewport = await getViewport();

  return (
    <>
      <MyPlayListControl />
      <SelectMyPlayListControl />
      <AuthLoginControl />
      <PlayerAction />
      <ProfileControl />
      {viewport === "mobile" && <MobileTopBar />}
      <MainAppBar viewport={viewport} />
      {children}  
    </>
  );
};

export default PublicLayout;
