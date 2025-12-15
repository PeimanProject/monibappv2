import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function LoadingAnimations() {
  return (
    <Box sx={{ width: 1 / 1, maxWidth: 600,py:2 }}>
      <Skeleton width={100} />
      <Skeleton animation="wave" />
      <Skeleton width={200} animation={false} />
      <Skeleton width={250} animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton width={100} animation={false} />
      <Skeleton width={250} animation="wave" />
    </Box>
  );
}
