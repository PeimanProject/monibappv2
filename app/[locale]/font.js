import localFont from "next/font/local";

export const tArabic = localFont({
  variable: "--arabic-font",
  display: "swap",
  src: [
    // {
    //   path: "./../assets/fonts/tarabic/TraditionalArabic.eot",
    //   weight: "normal",
    //   style: "normal",
    // },
    {
      path: "./../assets/fonts/tarabic/TraditionalArabic.ttf",
      weight: "normal",
      style: "normal",
    },
    {
      path: "./../assets/fonts/tarabic/TraditionalArabic.woff",
      weight: "normal",
      style: "normal",
    },
  ],
});

export const iranYekan = localFont({
  variable: "--global-font",
  display: "swap",
  src: [
    {
      path: "./../assets/fonts/iranyekan/IRANYekanXVF.woff",
      weight: "100 1000",
      style: "normal",
    },
  ],
});

export const iranSans = localFont({
  variable: "--global-font",
  display: "swap",
  src: [
    {
      path: "./../assets/fonts/iransans/woff2/IRANSansWeb.woff2",
      weight: "normal",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff/IRANSansWeb.woff",
      weight: "normal",
      style: "normal",
    },
    {
      path: "./../assets/fonts/iransans/ttf/IRANSansWeb.ttf",
      weight: "normal",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff2/IRANSansWeb_Black.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff/IRANSansWeb_Black.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "./../assets/fonts/iransans/ttf/IRANSansWeb_Black.ttf",
      weight: "900",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff2/IRANSansWeb_Bold.woff2",
      weight: "bold",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff/IRANSansWeb_Bold.woff",
      weight: "bold",
      style: "normal",
    },
    {
      path: "./../assets/fonts/iransans/ttf/IRANSansWeb_Bold.ttf",
      weight: "bold",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff2/IRANSansWeb_Medium.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff/IRANSansWeb_Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../assets/fonts/iransans/ttf/IRANSansWeb_Medium.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff2/IRANSansWeb_Light.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff/IRANSansWeb_Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./../assets/fonts/iransans/ttf/IRANSansWeb_Light.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff2/IRANSansWeb_UltraLight.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "./../assets/fonts/iransans/woff/IRANSansWeb_UltraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "./../assets/fonts/iransans/ttf/IRANSansWeb_UltraLight.ttf",
      weight: "200",
      style: "italic",
    },
  ],
});
