"use client";
import { MobileHomeActions } from "@/app/fragment/homeActions/mobileHomeActions";
import { HomeLastLecture } from "@/app/fragment/homeLastLecture/homeLastLecture";
import { MobileMainButtonsList } from "@/app/fragment/mainButtonsList/mobileMainButtonsList";
import { MobileSlider } from "@/app/fragment/slider/mobileSlider";
import { API } from "@/core/config/api";
import { Container, Typography, Button, Box } from "@mui/material";
import { HomeStore } from "./home";
import { useEffect, useState } from "react";
import { db } from "../libs/db";
import { useConnectivity } from "@/core/ConnectivityProvider";

export default function Home() {
  const viewport = "mobile";
  const [homeData, setHomeData] = useState(undefined);
  const [list, setList] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const { isConnected, isInitialized } = useConnectivity();
  const loadOfflineData = async () => {
    setLoading(true)
    try {
      // گرفتن ۴ لکچر آخر که قبلاً در دیتابیس ذخیره شده‌اند
      const offlineLectures = await db.lectures
        .orderBy('id')
        .reverse()
        .limit(4)
        .toArray();
      if (offlineLectures.length > 0) {
        // تبدیل فرمت لکچرهای Dexie به فرمتی که کامپوننت لیست انتظار دارد
        setList(offlineLectures);
      }
    } catch (error) {
      console.error("Error loading offline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequests = async () => {
    setLoading(true);
    try {
      // ۱. درخواست اطلاعات خانه
      const homeDateReq = await fetch(`${API().core}home/?forceDetect=${viewport}`);
      const hData = await homeDateReq.json();
      setHomeData(hData);

      // ۲. درخواست لیست آخرین لکچرها
      const listReq = await fetch(`${API().core}lastLecture/?size=4`);
      const lData = await listReq.json();
      setList(lData);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (isConnected) {
        await handleRequests();
      } else {
        await loadOfflineData()
      }
    }
    load();
  }, []);


  if (loading) {
    return <Typography m={5} textAlign={"center"}> در حال بارگذاری ...</Typography>
  }
  if ((homeData === null || list === null) && !loading) {
    return (
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", p: 3 }}>
        <Typography textAlign={"center"}>محتوایی برای نمایش یافت نشد</Typography>
        <Typography textAlign={"center"} variant="caption">لطفاً اتصال اینترنت خود را چک کنید</Typography>
        <Button variant="contained" onClick={handleRequests}>تلاش دوباره</Button>
      </Box>
    );
  }

  return (
    <>
      <HomeStore />
      {/* اسلایدر فقط در حالت آنلاین نمایش داده می‌شود */}
      {isConnected && homeData?.sliders && (
        <MobileSlider list={homeData.sliders} />
      )}
      <Container maxWidth="sm" sx={{ pt: 1, pb: 20 }}>
        <MobileMainButtonsList data={homeData?.count} />
        {/* بخش زنده و اکشن‌ها در حالت آفلاین حذف یا غیرفعال می‌شوند */}

        <MobileHomeActions
          isConnected={isConnected}
          liveCounter={homeData?.liveCounter}
          isLive={homeData?.isLive}
        />
        {
          isConnected &&
          <HomeLastLecture viewport="mobile" list={list} />
        }
      </Container>
    </>
  );
}