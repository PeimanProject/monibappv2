import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useMyPlayListStore } from "@/store/playListStore";
import { useTranslate } from "@/core/useTranslation";
import { AddToPlayListAction, UpdateUserPlayList } from "@/app/data/user/playlist/route";
import { useUserStore } from "@/store/useUserStore";

export const ManagePlaylist = ({ playlist, show, onClose }) => {
  const [{ title, id }, setValue] = React.useState({ title: "", id: null });
  const fetchList = useMyPlayListStore((state) => state.fetchList);
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useUserStore()
  const { get } = useTranslate()
  React.useEffect(() => {
    if (!!playlist?.id) {
      setValue(playlist);
    } else {
      setValue({ title: "", id: null });
    }
  }, [playlist, setValue]);

  const handleChange = React.useCallback(
    (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setValue((prv) => ({
        ...prv,
        [name]: value,
      }));
    },
    [setValue]
  );

  const submit = React.useCallback(async () => {
    setIsSubmit(true);
    if (title) {
      setIsLoading(true);
      if (!id) {
        await AddToPlayListAction(title, user?.token)
      } else {
        await UpdateUserPlayList({ title, token: user?.token, id })
      }
      setIsLoading(false);
      setIsSubmit(false);
      await fetchList(user?.token);
      onClose();
    }
  }, [setIsSubmit, title, id, onClose, setIsLoading]);

  React.useEffect(() => {
    setIsLoading(false);
    setIsSubmit(false);
  }, [show, setIsLoading, setIsSubmit]);

  return (
    <Dialog maxWidth="sm" open={show} onClose={onClose}>
      <DialogContent>
        <Box sx={{ p: 4 }}>
          <TextField
            onChange={handleChange}
            name="title"
            value={title}
            error={isSubmit && !title}
            label={get("Playlist.playList")}
          />
          {isSubmit && !title && (
            <Typography sx={{ color: "secondary.main", mt: 1, px: 2 }}>
              {get("Playlist.enterTitle")}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {get("Playlist.cancel")}
        </Button>
        <Button
          disabled={isLoading || !!!title}
          onClick={submit}
          variant="contained"
        >
          {get("Playlist.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
