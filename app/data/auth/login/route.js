import { API } from "@/core/config/api";

export async function Login(body) {
  const response = await fetch(`${API().security}/appLogin/`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      AppName: "monib_core_panel",
      apiCode: "N>LZB$*8;,nr(/]&9Va&P!.ur(&9Ucf6",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  if (result?.token) {
    // const { profile, access, isAdmin, sa, app_role, token } = result;
    // const response = NextResponse.json({
    //   profile,
    //   access,
    //   isAdmin,
    //   sa,
    //   app_role,
    // });
    // const session = await getIronSession(await cookies(), {
    //   password: process.env.AUTH_SECRET,
    //   cookieName: process.env.AUTH_TOKEN,
    // });

    // session.token = result?.token;
    // await session.save();
    return result
  } else {
    return { error: "Invalid credentials" };
  }
}
