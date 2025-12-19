import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useTranslate } from "@/core/useTranslation";

export const DesktopTitle = ({ title, description, lectureCount }) => {
  const { get } = useTranslate()

  return (
    <Box sx={{ minHeight: 100, bgcolor: "primary.dark" }}>
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", py: 2, width: 1 / 1 }}>
          <Box>
            <Typography
              sx={{ fontWeight: "bold" }}
              component={"h1"}
              variant="body1"
            >
              {title}
            </Typography>
            <Typography>{description}</Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box>
            <Typography>
              {digitsEnToFa(`${lectureCount}`)} {get("Lecture.lecture")}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
