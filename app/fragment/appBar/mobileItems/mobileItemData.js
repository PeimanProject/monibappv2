import { Box, Typography } from "@mui/material";
import { MenuItem } from "./menuItem";
import { format as formatJ } from "date-fns-jalali";
import { format } from "date-fns";
import Link from "next/link";

export const mainMenuData = [
  {
    id: "date",
    render: ({}) => (
      <>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption" sx={{ mx: 1 }}>
            {formatJ(new Date(), "EEE d MMMM yyyy")}
          </Typography>
          {/* <Typography variant="caption" sx={{ mx: 1 }}>
            {"۱۲ رجب ۱۴۴۶"}
          </Typography> */}
        </Box>
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ mx: 1 }}>
          {format(new Date(), "EEE d MMMM yyyy")}
        </Typography>
      </>
    ),
  },
  {
    id: "professor",
    render: ({ t, mode }) => (
      <MenuItem
        title={t("professor")}
        icon={`/icons/${mode}/items/professor.svg`}
      />
    ),
  },
  {
    id: "wisdom",
    render: ({ t, onClose }) => (
      <Box
        sx={{
          flex: 1,
          width: 1 / 1,
          a: {
            flex: 1,
            width: 1 / 1,
          },
        }}
      >
        <Link href={"/fa/wisdom"}>
          <MenuItem
            onChange={onClose}
            title={t("wisdom")}
            color="blue"
            icon={`/icons/wisdom.svg`}
          />
        </Link>
      </Box>
    ),
  },
  {
    id: "shop",
    render: ({ t, mode }) => (
      <Box
        sx={{ display: "flex", alignItems: "center", flex: 1, a: { flex: 1 } }}
      >
        <a href="https://shop.hedayatnoor.com/" target="_blank">
          <MenuItem
            title={t("shop")}
            subTitle={t("shopIran")}
            icon={`/icons/${mode}/items/book.svg`}
          />
        </a>
        <Box sx={{ mx: 1 }} />
        <a href="http://shop.monibapp.co.uk/" target="_blank">
          <MenuItem
            title={t("shop")}
            subTitle={t("shopUK")}
            icon={`/icons/${mode}/items/book.svg`}
          />
        </a>
      </Box>
    ),
  },
  {
    id: "social",
    render: ({ t, mode }) => (
      <Box
        sx={{ display: "flex", alignItems: "center", flex: 1, a: { flex: 1 } }}
      >
        <Link href="https://eitaa.com/hedayatnoor" target="_blank">
          <MenuItem icon={`/icons/${mode}/items/eata.svg`} title={t("eata")} />
        </Link>
        <Box sx={{ mx: 1 }} />
        <Link href="https://t.me/MohammadAliAnsari" target="_blank">
          <MenuItem
            icon={`/icons/${mode}/items/teleg.svg`}
            title={t("telegram")}
          />
        </Link>
      </Box>
    ),
  },
  {
    id: "web",
    render: ({ t, mode }) => (
      <Box
        sx={{ display: "flex", alignItems: "center", flex: 1, a: { flex: 1 } }}
      >
        <Link
          href="https://www.instagram.com/hedayatnoor/?hl=fa"
          target="_blank"
        >
          <MenuItem
            icon={`/icons/${mode}/items/instagram.svg`}
            title={t("instagram")}
          />
        </Link>
        <Box sx={{ mx: 1 }} />
        <Link href="https://hedayatnoor.com/" target="_blank">
          <MenuItem icon={`/icons/${mode}/items/site.svg`} title={t("web")} />
        </Link>
      </Box>
    ),
  },
  {
    id: "support",
    render: ({ t, mode, onClose }) => (
      <Box
        sx={{
          flex: 1,
          width: 1 / 1,
          a: {
            flex: 1,
            width: 1 / 1,
          },
        }}
      >
        <Link href={"/fa/support"}>
          <MenuItem
            onChange={onClose}
            title={t("support")}
            icon={`/icons/${mode}/items/support.svg`}
          />
        </Link>
      </Box>
    ),
  },
  {
    id: "setting",
    render: ({ onChange, mode }) => (
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <Box sx={{ flex: 1 }} />
        {/* <MenuItem center icon={`/icons/${mode}/items/profile.svg`} />
        <Box sx={{ mx: 1 }} /> */}
        <MenuItem
          center
          icon={`/icons/${mode}/items/setting.svg`}
          onChange={onChange("setting")}
        />
      </Box>
    ),
  },
];
