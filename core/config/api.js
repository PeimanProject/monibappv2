import { getSSRToken } from "../ssrToken";

const BASE_ASSETS = "https://core.monibapp.ir/";
const PRO_CORE = "https://core.monibapp.ir/";

export const API = () => {
  return {
    security: `https://core.monibapp.ir/security/v2/`,
    search: `${PRO_CORE}search/`,
    core: `${PRO_CORE}app/v2/`,
    assets: `${BASE_ASSETS}prot/file/`,
    assetsLink: (link) => `${BASE_ASSETS}files/${link}`,
  };
};

export const getHeaders = async () => {
  return {
    "content-Type": "application/json",
    Authorization: await getSSRToken(),
    AppName: "monib_ai",
  };
};

export const getShareURL = () => {
  
  return `https://monibapp.ir/`;
};
