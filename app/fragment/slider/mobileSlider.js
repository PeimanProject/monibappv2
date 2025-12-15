import React from "react";
import { MobileSpringSlider } from "./SpringSlider";

export const MobileSlider = ({ list, ...props }) => {
  return <MobileSpringSlider list={list} {...props} />;
};
