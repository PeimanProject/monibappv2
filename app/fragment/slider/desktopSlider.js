import React from "react";
import { DesktopSpringSlider } from "./SpringSlider";

export const DesktopSlider = ({ list, ...props }) => {
  return <DesktopSpringSlider list={list} {...props} />;
};
