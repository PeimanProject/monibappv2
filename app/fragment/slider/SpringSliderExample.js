import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { SpringSlider, DesktopSpringSlider, MobileSpringSlider } from "./SpringSlider";

// Example data structure for the slider
const exampleSliderData = [
  {
    src: "/images/b1.png",
    alt: "Banner 1",
    title: "Welcome to Monib",
    description: "Discover amazing content"
  },
  {
    src: "/images/b2.png", 
    alt: "Banner 2",
    title: "Featured Content",
    description: "Check out our latest features"
  },
  {
    src: "/images/b3.png",
    alt: "Banner 3", 
    title: "New Updates",
    description: "Stay updated with our latest news"
  },
  {
    src: "/images/b4.png",
    alt: "Banner 4",
    title: "Special Offer",
    description: "Don't miss out on our special deals"
  }
];

export const SpringSliderExample = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Spring Slider Examples
      </Typography>
      
      {/* Basic Spring Slider */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Spring Slider
        </Typography>
        <SpringSlider 
          list={exampleSliderData}
          height={250}
          autoPlay={true}
          autoPlayInterval={3000}
        />
      </Paper>

      {/* Desktop Spring Slider */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Desktop Spring Slider
        </Typography>
        <DesktopSpringSlider 
          list={exampleSliderData}
          autoPlay={true}
          autoPlayInterval={4000}
          showControls={true}
          showDots={true}
        />
      </Paper>

      {/* Mobile Spring Slider */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Mobile Spring Slider
        </Typography>
        <MobileSpringSlider 
          list={exampleSliderData}
          autoPlay={true}
          autoPlayInterval={3500}
          showControls={true}
          showDots={true}
        />
      </Paper>

      {/* Custom Configuration */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Custom Configuration
        </Typography>
        <SpringSlider 
          list={exampleSliderData}
          height={200}
          width="80%"
          autoPlay={false}
          showControls={true}
          showDots={true}
        />
      </Paper>
    </Box>
  );
};

export default SpringSliderExample;
