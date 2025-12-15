import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMyPlayListStore } from "@/store/playListStore";

export const DeletePlayList = ({
  show = false,
  id,
  onClose,
  item,
  currentList,
  isTopic,
  isLecture,
  isWisdom,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("Playlist");
  const { fetchList } = useMyPlayListStore((state) => state);
  
 

  const submit = React.useCallback(async () => {
    setIsLoading(true);
    if (!!item) {
      if (isTopic) {
        await fetch(`/api/user/playlist/topic`, {
          method: "DELETE",
          body: JSON.stringify({
            playlistId: currentList.id,
            topicId: item.topicId,
          }),
          headers: {
            "content-Type": "application/json",
          },
        });
      }

      if (isLecture) {
        await fetch(`/api/user/playlist/lecture`, {
          method: "DELETE",
          body: JSON.stringify({
            playlistId: currentList.id,
            lectureId: item.lectureId,
          }),
          headers: {
            "content-Type": "application/json",
          },
        });
      }

      if (isWisdom) {
        await fetch(`/api/user/playlist/`, {
          method: "DELETE",
          body: JSON.stringify({
            playlistId: currentList.id,
            wisdomId: item.id,
          }),
          headers: {
            "content-Type": "application/json",
          },
        });
      }
    } else {
      await fetch(`/api/user/playlist/?id=${id}`, {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
        },
      });
    }

    await fetchList();
    onClose();
  }, [
    id,
    setIsLoading,
    onClose,
    currentList,
    isLecture,
    isTopic,
    item,
    isWisdom,
  ]);

  useEffect(() => setIsLoading(false), [show, setIsLoading]);

  return (
    <Dialog fullWidth maxWidth="sm" open={show}>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography>{t("deletedPlaylist")}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button disabled={isLoading} onClick={submit} variant="contained">
          {t("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
