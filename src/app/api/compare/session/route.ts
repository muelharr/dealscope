import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get('ids') || searchParams.get('productIds') || '';

  if (!ids) {
    return NextResponse.json(
      { success: false, error: { message: 'ids query parameter is required' } },
      { status: 400 }
    );
  }

  try {
    const backendRes = await fetch(`http://localhost:4000/api/v1/compare?ids=${encodeURIComponent(ids)}`);
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
