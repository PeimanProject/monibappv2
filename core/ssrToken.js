import { useUserStore } from "@/store/useUserStore";

export const getToken = () => {
  const state = useUserStore.getState()
  const user = state.user

  return user?.token;
};