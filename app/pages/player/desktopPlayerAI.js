import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export const DesktopPlayerAI = () => {
  const t = useTranslations("Lecture");

  return (
    <Box
      sx={{
        mt: 3,
        maxWidth: 430,
        border: 1,
        borderColor: "divider",
        p: 0.5,
        borderRadius: 5,
        position: "relative",
      }}
    >
      <Typography
        sx={{
          left: 16,
          top: -12,
          position: "absolute",
          px: 1,
          bgcolor: "background.default",
        }}
      >
        {t("AI_Tools")}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
        <Button
          size="small"
          color="inherit"
          variant="outlined"
          sx={{ mx: 0.2 }}
          fullWidth
          endIcon={
            <Image alt="cc" src="/icons/cc.svg" width={24} height={24} />
          }
        >
          {t("cc")}
        </Button>
        <Button
          size="small"
          color="inherit"
          variant="outlined"
          sx={{ mx: 0.2 }}
          fullWidth
          
          endIcon={
            <Image alt="summary" src="/icons/summary.svg" width={24} height={24} />
          }
        >
          {t("summary")}
        </Button>
        <Button
          size="small"
          color="inherit"
          variant="outlined"
          sx={{ mx: 0.2 }}
          fullWidth
          endIcon={
            <Image
              alt="transcript"
              src="/icons/transcript.svg"
              width={24}
              height={24}
            />
          }
        >
          {t("transcript")}
        </Button>
      </Box>
    </Box>
  );
};
