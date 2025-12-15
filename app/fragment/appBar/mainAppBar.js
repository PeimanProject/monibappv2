
import React from "react";
import { DesktopAppBar } from "./desktopAppBar";
import { MobileAppBar } from "./mobileAppBar";

export const MainAppBar = ({ viewport }) => {
  return (
    <>
      {viewport === "desktop" && <DesktopAppBar />}
      {viewport === "mobile" && <MobileAppBar />}
    </>
  );
};
