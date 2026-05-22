import packageJson from "../../package.json";

/** نسخهٔ وب / fallback؛ روی اندروید و iOS از App.getInfo() استفاده کنید */
export const PACKAGE_VERSION = packageJson.version;
