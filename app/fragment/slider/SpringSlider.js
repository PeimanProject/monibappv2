"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSpring, animated, useTransition } from "@react-spring/web";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";
import _ from "lodash";

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

  // Pause/play on hover
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

  // Spring animation for the slider container
  const slideSpring = useSpring({
    transform: `translateX(-${currentIndex * 100}%)`,
    config: { tension: 300, friction: 30 },
  });

  // Fade transition for individual slides
  const transitions = useTransition(currentIndex, {
    from: { opacity: 0, transform: "scale(1.1)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.9)" },
    config: { tension: 300, friction: 30 },
  });

  if (!list || list.length === 0) {
    return null;
  }

  const isMobile = variant === "mobile";
  const sliderHeight = isMobile ? 140 : height;

  return (
    <Box
      sx={{
        position: "relative",
        width,
        height: sliderHeight,
        overflow: "hidden",
        borderRadius: isMobile ? 0 : 6,
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
          <Box
            key={index}
            sx={{
              width: `${100 / list.length}%`,
              height: "100%",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {item.src && (
              <Image
                alt={item.alt || `Slider Image ${index + 1}`}
                src={item.src}
                fill
                style={{
                  objectFit: "contain",
                }}
                priority={index === 0}
              />
            )}
          </Box>
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
          }}
        >
          {list.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
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
