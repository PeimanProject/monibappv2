"use client";
import { MobileSearch } from "@/app/pages/search/mobileSearch";
import React from "react";

const SearchPage = ({ }) => {

  const viewport = "mobile";
  const query = "";
  return <MobileSearch desktop={viewport === "desktop"} q={query} />;
};

export default SearchPage;