import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  // Await the params object before accessing its properties
  const { slug } = await params;

  // Get the ID from the slug (last part of the path)
  const id = slug[slug.length - 1];

  // Construct the external URL
  const externalUrl = `https://api.ub.uib.no/items/${id}?as=iiif`;

  // Redirect to the external URL
  return NextResponse.redirect(externalUrl);
}
