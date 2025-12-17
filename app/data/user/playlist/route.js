
import { API } from "@/core/config/api";

export async function GetUserPlayList(token) {
  const response = await fetch(`${API().core}user/playList/`, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return { error: "not-valid" }
  const data = await response.json()


  return data;
}

export async function AddToPlayListAction(title, token) {

  const response = await fetch(`${API().core}user/playList/`, {
    method: "POST",
    body: JSON.stringify({ title }),
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) return { error: "not-valid" }
  const data = await response.json();



  return data;
}

export async function UpdateUserPlayList({ token, title, id }) {

  const response = await fetch(`${API().core}user/playList/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return { error: "not-valid" }
  const data = await response.json()
  return data;
}

export async function DeleteUserPlayList({ token, id }) {
  console.log({ token, id })
  if (!id) {
    return { error: "id is required" };
  }

  const response = await fetch(`${API().core}user/playList/${id}`, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
      AppName: "monibWebApp",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log({ response })
  if (!response.ok) return { error: "not-valid" }

  return {};
}
