import { getViewport } from "@/app/libs/isMobileDetect";
import React from "react";
import { MobileWisdom } from "@/app/pages/wisdom/mobileWisdom";
import { API } from "@/core/config/api";
import { appConfig } from "@/core/config/values";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const req = await fetch(`${API().core}wisdom/${id}`);
  const wisdom = await req.json();

  const title = `${wisdom.title} | ${appConfig.title}`;

  return {
    title,
    openGraph: {
      title,
      images: wisdom?.image,
      type: "video.other",
      url: wisdom?.file,
      description: appConfig.description,
      videos: [{
        url: wisdom?.file,
        width: 1280,  // adjust according to your video dimensions
        height: 720,  // adjust according to your video dimensions
        type: "video/mp4"  // adjust based on your video format
      }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: appConfig.description,
      siteId: "",
      creator: "Monib",
      creatorId: "",
      images: [wisdom?.image],
    },
  };
}

const WisdomPage = async ({ params }) => {
  const { id } = await params;
  const viewport = await getViewport();
  const listReq = await fetch(`${API().core}wisdom?page=0&size=100`);
  const list = await listReq.json();

  let wisdom;

  if (id) {
    const req = await fetch(`${API().core}wisdom/${id}`);
    wisdom = await req.json();
  }

  return (
    <>
      {viewport === "mobile" && <MobileWisdom SSRList={list} wisdom={wisdom} />}
    </>
  );
};

export default WisdomPage;
