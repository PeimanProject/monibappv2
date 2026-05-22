"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import {
  getSliderHref,
  isExternalSliderHref,
  toSliderNavigationHref,
} from "./sliderUtils";

const SliderSlide = ({ item, slideWidthPercent, isMobile, children }) => {
  const href = getSliderHref(item);
  const navHref = href ? toSliderNavigationHref(href) : null;
  const isExternal = navHref && isExternalSliderHref(navHref);

  const boxSx = {
    width: slideWidthPercent,
    height: "100%",
    position: "relative",
    flexShrink: 0,
    display: "block",
    ...(navHref ? { cursor: "pointer" } : {}),
  };

  if (!navHref) {
    return <Box sx={boxSx}>{children}</Box>;
  }

  if (isExternal) {
    return (
      <Box
        component="a"
        href={navHref}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ ...boxSx, textDecoration: "none", color: "inherit" }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={Link}
      href={navHref}
      sx={{ ...boxSx, textDecoration: "none", color: "inherit" }}
    >
      {children}
    </Box>
  );
};

export const SpringSlider = ({
  list = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = false,
  showDots = true,
  height = 300,
  width = "100%",
  variant = "mobile", // "desktop" or "mobile"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && list.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length);
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, list.length, autoPlayInterval]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? list.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    if (autoPlay) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  };

  if (!list || list.length === 0) {
    return null;
  }

  const isMobile = variant === "mobile";
  const sliderHeight = isMobile ? 140 : height;
  const slideWidthPercent = `${100 / list.length}%`;

  return (
    <Box
      sx={{
        position: "relative",
        width,
        height: sliderHeight,
        overflow: "hidden",
        borderRadius: isMobile ? 1 : 6,
        m: 0,
        mt: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
        display: "block",
        lineHeight: 0,
        bgcolor: isMobile ? "background.default" : undefined,
        "&:hover .slider-controls": {
          opacity: 1,
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main slider container */}
      <Box
        sx={{
          display: "flex",
          width: `${list.length * 100}%`,
          height: "100%",
          transform: `translateX(-${currentIndex * (100 / list.length)}%)`,
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {list.map((item, index) => (
          <SliderSlide
            key={index}
            item={item}
            slideWidthPercent={slideWidthPercent}
            isMobile={isMobile}
          >
            {item.src && (
              <Image
                alt={item.alt || `Slider Image ${index + 1}`}
                src={item.src}
                fill
                style={{
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
                priority={index === 0}
                unoptimized={
                  typeof item.src === "string" && item.src.startsWith("http")
                }
              />
            )}
          </SliderSlide>
        ))}
      </Box>

      {/* Navigation Controls */}
      {showControls && list.length > 1 && (
        <>
          <IconButton
            className="slider-controls"
            onClick={goToPrevious}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              opacity: 0,
              transition: "opacity 0.3s",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            className="slider-controls"
            onClick={goToNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              opacity: 0,
              transition: "opacity 0.3s",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && list.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 2,
          }}
        >
          {list.map((_, index) => (
            <Box
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  index === currentIndex ? "white" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "white",
                  transform: "scale(1.2)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// Convenience components for desktop and mobile
export const DesktopSpringSlider = (props) => (
  <SpringSlider {...props} variant="desktop" height={300} />
);

export const MobileSpringSlider = (props) => (
  <SpringSlider {...props} variant="mobile" height={140} />
);
