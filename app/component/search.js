import { useTranslate } from "@/core/useTranslation";
import { Divider, IconButton, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Image from "next/image";

export const SearchControl = ({
  placeholder,
  onChange,
  onKeyDown,
  onSearch,
  value,
  maxWidth = 250,
}) => {
  const { get } = useTranslate()
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 12,
        px: 2,
        py: 0.5,
        width: 1 / 1,
        maxWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <InputBase
        sx={{
          flex: 1,
          "& ::placeholder": {
            color: "black",
            opacity: 1,
          },
        }}
        type="search"
        inputMode="search"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={get("Common.searchAct")}
      />
      <Divider sx={{ mx: 0.5 }} />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => onSearch(null)}>
          <Image
            alt="Find"
            width={24}
            height={24}
            src={`/icons/${theme.palette.mode}/find.svg`}
          />
        </IconButton>
      </Box>
    </Box>
  );
};
