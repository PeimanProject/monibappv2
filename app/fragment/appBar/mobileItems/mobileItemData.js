import { Box, Typography } from "@mui/material";
import { MenuItem } from "./menuItem";
import { format as formatJ } from "date-fns-jalali";
import { format } from "date-fns";
import Link from "next/link";
import { usePlayListStore } from "@/store/usePlayListStore";
import React from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAuthLoginStore } from "@/store/layout/useProfileStore";

export const mainMenuData = [
  {
    id: "date",
    render: ({ }) => (
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
    render: ({ get, mode }) => (
      <MenuItem
        title={get("Menu.professor")}
        icon={`/icons/${mode}/items/professor.svg`}
      />
    ),
  },
  {
    id: "wisdom",
    render: ({ get, onClose }) => (
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
        <Link href={"/wisdom"}>
          <MenuItem
            onChange={onClose}
            title={get("Menu.wisdom")}
            color="blue"
            icon={`/icons/wisdom.svg`}
          />
        </Link>
      </Box>
    ),
  },
  {
    id: "shop",
    render: ({ get, mode }) => (
      <Box
        sx={{ display: "flex", alignItems: "center", flex: 1, a: { flex: 1 } }}
      >
        <a href="https://shop.hedayatnoor.com/" target="_blank">
          <MenuItem
            title={get("Menu.shop")}
            subTitle={get("Menu.shopIran")}
            icon={`/icons/${mode}/items/book.svg`}
          />
        </a>
        <Box sx={{ mx: 1 }} />
        <a href="http://shop.monibapp.co.uk/" target="_blank">
          <MenuItem
            title={get("Menu.shop")}
            subTitle={get("Menu.shopUK")}
            icon={`/icons/${mode}/items/book.svg`}
          />
        </a>
      </Box>
    ),
  },
  {
    id: "social",
    render: ({ get, mode }) => (
      <Box
        sx={{ display: "flex", alignItems: "center", flex: 1, a: { flex: 1 } }}
      >
        <Link href="https://eitaa.com/hedayatnoor" target="_blank">
          <MenuItem icon={`/icons/${mode}/items/eata.svg`} title={get("Menu.eata")} />
        </Link>
        <Box sx={{ mx: 1 }} />
        <Link href="https://t.me/MohammadAliAnsari" target="_blank">
          <MenuItem
            icon={`/icons/${mode}/items/teleg.svg`}
            title={get("Menu.telegram")}
          />
        </Link>
      </Box>
    ),
  },
  {
    id: "web",
    render: ({ get, mode }) => (
      <Box
        sx={{ display: "flex", alignItems: "center", flex: 1, a: { flex: 1 } }}
      >
        <Link
          href="https://www.instagram.com/hedayatnoor/?hl=fa"
          target="_blank"
        >
          <MenuItem
            icon={`/icons/${mode}/items/instagram.svg`}
            title={get("Menu.instagram")}
          />
        </Link>
        <Box sx={{ mx: 1 }} />
        <Link href="https://hedayatnoor.com/" target="_blank">
          <MenuItem icon={`/icons/${mode}/items/site.svg`} title={get("Menu.web")} />
        </Link>
      </Box>
    ),
  },
  {
    id: "support",
    render: ({ get, mode, onClose }) => (
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
        <Link href={"/support"}>
          <MenuItem
            onChange={onClose}
            title={get("Menu.support")}
            icon={`/icons/${mode}/items/support.svg`}
          />
        </Link>
      </Box>
    ),
  },
  {
    id: "playlist",
    render: ({ get, mode, onClose }) => {
      const user = useUserStore((state) => state.user);
      const setShowLogin = useAuthLoginStore((state) => state.setShow);
      const setShowPlayList = usePlayListStore((state) => state.setShow);
      const handlePlayListClick = async () => {
        if (!!!user) {
          await onClose()
          setShowLogin(true);
          return;
        }
        await onClose()
        setShowPlayList(true);
      }

      return <Box
        sx={{
          flex: 1,
          width: 1 / 1,
          a: {
            flex: 1,
            width: 1 / 1,
          },
        }}
      >
        <MenuItem
          onChange={handlePlayListClick}
          title={get("Menu.playlist")}
          icon={`/icons/light/playlist.svg`}
        />
      </Box>

    },
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
