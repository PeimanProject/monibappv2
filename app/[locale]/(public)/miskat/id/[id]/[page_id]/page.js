import { getViewport } from "@/app/libs/isMobileDetect";
import PageMobileMiskat from "@/app/pages/miskat/pageMobileMiskat";
import { API } from "@/core/config/api";

export default async function Page({ params }) {
  const { id, page_id } = await params;

  const viewport = await getViewport();

  const contentReq = await fetch(`${API().core}/miskat`, {
    method: "POST",
    body: JSON.stringify({ id: id, page_id: page_id, page: true }),
    cache: "no-cache",
    headers: {
      "content-Type": "application/json",
    },
  });

  const content = await contentReq.json();

  return (
    <>
      <PageMobileMiskat content={content} viewport={viewport} page_id={page_id} id={id} />
    </>
  );
}
