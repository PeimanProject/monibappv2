import { getViewport } from "@/app/libs/isMobileDetect";
import { MobileSearch } from "@/app/pages/search/mobileSearch";
import React from "react";

 const SearchPage = async ({searchParams}) => {
  
  const viewport = await getViewport();
  const query = (await searchParams)?.q || "";
  return <MobileSearch desktop={viewport==="desktop"} q={query} />;
};

export default SearchPage;