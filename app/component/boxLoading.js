import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export const BoxLoading = () => {
  return (
    <Box sx={{ maxWidth: 500, width: 1 / 1 }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton width="60%" animation={false} />
      <Skeleton animation="wave" />
      <Skeleton width="70%" animation={false} />
      <Skeleton animation="wave" />
    </Box>
  );
};
