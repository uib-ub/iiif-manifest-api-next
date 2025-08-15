import { NextResponse } from 'next/server';

export async function GET() {
  const externalUrl = `https://api.ub.uib.no/`;

  // Redirect to the external URL
  return NextResponse.redirect(externalUrl);
}
