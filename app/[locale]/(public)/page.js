import { MobileHomeActions } from "@/app/fragment/homeActions/mobileHomeActions";
import { HomeLastLecture } from "@/app/fragment/homeLastLecture/homeLastLecture";
import { MobileMainButtonsList } from "@/app/fragment/mainButtonsList/mobileMainButtonsList";
import { DesktopSlider } from "@/app/fragment/slider/desktopSlider";
import { MobileSlider } from "@/app/fragment/slider/mobileSlider";
import { getViewport } from "@/app/libs/isMobileDetect";
import { API } from "@/core/config/api";
import { Container } from "@mui/material";
import { HomeStore } from "./home";
import DesktopPage from "./desktopPage";

export default async function Home() {
  const viewport = await getViewport();

  const homeDateReq = await fetch(`${API().core}home/?forceDetect=${viewport}`);
  const homeData = await homeDateReq.json();

  const listReq = await fetch(`${API().core}lastLecture/?size=4`);
  const list = await listReq.json();

  return (
    <>
      <HomeStore />
      {viewport === "desktop" && (
        <Container disableGutters maxWidth="md" sx={{ py: 2, px: 8 }}>
          <DesktopSlider list={homeData?.sliders} />
          <DesktopPage data={homeData} list={list} />

          {/* <Box sx={{ display: "flex", width: 1 / 1, mt: 2 }}>
            <Box sx={{ flex: 1 }}>
              <DesktopMainButtonsList data={homeData.count} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <DesktopHomeActions
                liveCounter={homeData.liveCounter}
                live={homeData.live}
                isLive={homeData.isLive}
              />
              <HomeLastLecture viewport="desktop" />
            </Box>
          </Box> */}
        </Container>
      )}
      {viewport === "mobile" && (
        <>
          <MobileSlider list={homeData?.sliders} />
          <Container maxWidth="sm" sx={{ pt: 1, pb: 20 }}>
            <MobileMainButtonsList data={homeData.count} />
            <MobileHomeActions
              liveCounter={homeData.liveCounter}
              isLive={homeData.isLive}
            />
            <HomeLastLecture viewport="mobile" />
          </Container>
        </>
      )}
    </>
  );
}
