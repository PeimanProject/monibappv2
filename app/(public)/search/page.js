"use client";
import { MobileSearch } from "@/app/pages/search/mobileSearch";
import { useSearchParams } from "next/navigation";
import React from "react";

const SearchPage = () => {
  const searchParams = useSearchParams()
  const viewport = "mobile";
  const query = searchParams.get('q') || "";
  return <MobileSearch desktop={viewport === "desktop"} q={query} />;
};

export default SearchPage;