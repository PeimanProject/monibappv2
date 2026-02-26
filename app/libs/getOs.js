
import { Device } from '@capacitor/device';
export const GetOs = async () => {
  const info = await Device.getInfo();
  return info.platform;
};
