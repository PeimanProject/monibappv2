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
import { useMyPlayListStore } from "@/store/playListStore";
import { useTranslate } from "@/core/useTranslation";
import { useUserStore } from "@/store/useUserStore";
import { DeleteUserPlayList } from "@/app/data/user/playlist/route";
import { DeleteUserPlayListByType } from "@/app/data/user/playlist/type/route";

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
  const { fetchList } = useMyPlayListStore((state) => state);
  const { user } = useUserStore()
  const { get } = useTranslate()
  const submit = React.useCallback(async () => {
    setIsLoading(true);
    if (!!item) {
      if (isTopic) {
        await DeleteUserPlayListByType({
          body: {
            playlistId: currentList.id,
            topicId: item.topicId,
          },
          token: user?.token,
          type: "topic"
        })

      }

      if (isLecture) {
        await DeleteUserPlayListByType({
          body: {
            playlistId: currentList.id,
            lectureId: item.lectureId,
          },
          token: user?.token,
          type: "lecture"
        })
      }

      if (isWisdom) {
        await DeleteUserPlayListByType({
          body: {
            playlistId: currentList.id,
            wisdomId: item.id,
          },
          token: user?.token,
        })
      }
    } else {
      await DeleteUserPlayList({ token: user?.token, id })
    }

    await fetchList(user?.token);
    onClose();
  }, [
    id,
    onClose,
    currentList,
    isLecture,
    isTopic,
    item,
    isWisdom,
    user, // Added missing dependency
    fetchList
  ]);

  useEffect(() => setIsLoading(false), [show, setIsLoading]);

  return (
    <Dialog fullWidth maxWidth="sm" open={show}>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography>{get("Playlist.deletedPlaylist")}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {get("Playlist.cancel")}
        </Button>
        <Button disabled={isLoading} onClick={submit} variant="contained">
          {get("Playlist.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
