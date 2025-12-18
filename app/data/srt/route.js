
export async function SrtReq({ lectureId, filename }) {
  try {

    const response = await fetch(
      `https://bundles.monibapp.ir/srt_vtt/${lectureId}/?filename=${filename}`,
      {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          AppName: "monib_ai",
        },
      }
    );

    let data = await response.text();

    return data;
  } catch (err) {
    return { err }
  }
}
