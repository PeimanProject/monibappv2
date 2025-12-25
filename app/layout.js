import { StyleProvider } from "@/theme/theme";
import { SSR_GetTheme } from "@/core/ssrGetTheme";
import { iranSans, iranYekan, tArabic } from "./font";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics } from "@next/third-parties/google";
import { EventLayout } from "./eventLayout";
import { IOSAudioManager } from "@/app/component/iosAudioManager";
import { MicrosoftClarity } from "@/metric/microsoftClarity";
import { ServiceWorkerRegistration } from "@/app/component/serviceWorkerRegistration";
import BackButtonHandler from "@/core/backButtonHandler";

// export const metadata = {
//   title: appConfig.title,
//   metadataBase: new URL("https://monibapp.ir/"),
//   generator: "Next.js",
//   referrer: "origin-when-cross-origin",
//   description: appConfig.description,
//   keywords: [""],
//   description: "",
//   url: "https://monibapp.ir/",
//   siteName: "Admin",
//   alternates: {
//     canonical: "/",
//     languages: {
//       "en-US": "/en",
//       "fa-IR": "/fa",
//     },
//   },
//   icons: [{ rel: "apple-touch-icon", url: "/apple-icon-2048x2048.png" }],
//   apple: {
//     "apple-mobile-web-app-title": appConfig.title,
//     "apple-mobile-web-app-capable": "yes",
//     "apple-mobile-web-app-status-bar-style": "default",
//   },
//   openGraph: {
//     title: appConfig.title,
//     images: "/poster.jpg",
//     description: appConfig.description,
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: appConfig.title,
//     description: appConfig.description,
//     siteId: "",
//     creator: "Monib",
//     creatorId: "",
//     images: ["https://monibapp.ir/poster.jpg"],
//   },
//   other: {
//     "mobile-web-app-capable": "yes",
//     "apple-mobile-web-app-capable": "yes",
//     "apple-mobile-web-app-status-bar-style": "default",
//     "apple-mobile-web-app-title": appConfig.title,
//     "format-detection": "telephone=no",
//     "apple-itunes-app": "app-argument=monib-ai",
//   },
// };

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover", // Essential
};

const fonts = { iranSans, iranYekan };

export default async function RootLayout({ children }) {

  let dir = "rtl"

  const theme = await SSR_GetTheme();

  const viewport = "mobile";

  // const session = await getIronSession(await cookies(), {
  //   password: process.env.AUTH_SECRET,
  //   cookieName: process.env.AUTH_TOKEN,
  // });

  let user = null;

  // if (session?.token) {
  //   const userReq = await fetch(`${API().security}data/info/`, {
  //     headers: {
  //       "content-Type": "application/json",
  //       AppName: "monib_core_panel",
  //       apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
  //       Authorization: `Bearer ${session.token}`,
  //     },
  //   });
  //   user = await userReq.json();
  // }

  return (
    <html
      lang={"fa"}
      data-theme="light"
      theme="classic"
      dir={dir}
      prefix="og: http://ogp.me/ns#"
    >
      <body
        suppressHydrationWarning={true}
        className={`${fonts[theme.theme.fontFamily].variable} ${tArabic.variable
          }`}
      >
        <BackButtonHandler />
        <EventLayout />
        <IOSAudioManager />
        <ServiceWorkerRegistration />
        <NextTopLoader color="#FE4A23" height={4} showSpinner={false} />
        <StyleProvider theme={theme} dir={dir} viewport={viewport}>
          {children}
        </StyleProvider>
        <GoogleAnalytics gaId="G-BH8L7RC80X" />
        <MicrosoftClarity />
      </body>
    </html>
  );
}