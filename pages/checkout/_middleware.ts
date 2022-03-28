import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { isValidToken } from "../../utils/jwt";

// Nextjs middeware
export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  /* const { token = "" } = req.cookies;

  try {
    await isValidToken(token);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?p=${req.page.name}`, req.url)
    );
  } */
  const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
  if(!session) {
    return NextResponse.redirect(
      new URL(`/auth/login?p=${req.page.name}`, req.url)
    );
  }
  return NextResponse.next();
}
