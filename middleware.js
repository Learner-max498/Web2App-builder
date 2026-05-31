import { NextResponse } from 'next/server';

export const config = {
  matcher: '/:path*',
};

export default function middleware(req) {
  const host = req.headers.get('host') || '';
  const url = req.nextUrl;

  // Check if it's a subdomain of devra.name.ng
  // e.g. druplux.devra.name.ng
  const parts = host.split('.');
  
  // devra.name.ng = 3 parts, so subdomain exists if parts > 3
  // druplux.devra.name.ng = 4 parts
  if (parts.length >= 4 && host.endsWith('.devra.name.ng')) {
    const subdomain = parts[0];
    
    // Skip www
    if (subdomain === 'www') return NextResponse.next();
    
    // Get the path
    const path = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
    
    // Proxy to Supabase serve-site function
    const target = `https://jxdobdllxihmfssodrka.supabase.co/functions/v1/serve-site?site=${subdomain}&path=${path}`;
    
    return NextResponse.rewrite(target);
  }

  return NextResponse.next();
}
