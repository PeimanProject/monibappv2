"use client";
import React, { useEffect, useState, Suspense } from "react";
import { MobileWisdom } from "@/app/pages/wisdom/mobileWisdom";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

const WisdomContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get ?id=123 from URL
  const [list, setList] = useState(null);
  const [wisdom, setWisdom] = useState(null);

  // Handler for the full list
  const handleListReq = async () => {
    try {
      const listReq = await fetch(`${API().core}wisdom?page=0&size=100`);
      const data = await listReq.json();
      setList(data);
    } catch (error) {
      console.error("Error fetching wisdom list:", error);
    }
  };

  // Handler for a single wisdom item
  const handleGetSingleWisdom = async (wisdomId) => {
    try {
      const req = await fetch(`${API().core}wisdom/${wisdomId}`);
      const data = await req.json();
      setWisdom(data);
    } catch (error) {
      console.error("Error fetching single wisdom:", error);
    }
  };

  // Effect 1: Always load the list
  useEffect(() => {
    handleListReq();
  }, []);

  // Effect 2: Load single wisdom only if ID is present in URL
  useEffect(() => {
    if (id) {
      handleGetSingleWisdom(id);
    } else {
      setWisdom(null); // Reset if going back to the full list
    }
  }, [id]);

  // Loading Logic:
  // 1. If no ID is in URL, we only wait for the list.
  // 2. If an ID is in URL, we wait for both the list and the specific wisdom.
  const isLoading = id ? (!list || !wisdom) : !list;

  if (isLoading) {
    return (
      <Typography m={5} textAlign={"center"}>
        در حال بارگذاری ...
      </Typography>
    );
  }

  return <MobileWisdom SSRList={list} wisdom={wisdom} />
};

// Main Export wrapped in Suspense for Next.js Static Export
export default function Page() {
  return (
    <Suspense fallback={<Typography m={5} textAlign={"center"}>در حال بارگذاری ...</Typography>}>
      <WisdomContent />
    </Suspense>
  );
}