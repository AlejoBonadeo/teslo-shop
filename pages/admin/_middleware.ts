import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  
  const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if(!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL('/404', req.url));
  }
  return NextResponse.next();
}
