import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { image, style } = await req.json();

    if (!image || !style) {
      return NextResponse.json(
        { error: 'Image and style are required' },
        { status: 400 }
      );
    }

    // For now, return the original image with style metadata
    // In production, this would use a style transfer model
    return NextResponse.json({
      image: image,
      style,
      message: `Applied ${style} transformation`,
    });
  } catch (error) {
    console.error('Transform API error:', error);
    return NextResponse.json(
      { error: 'Failed to transform image' },
      { status: 500 }
    );
  }
}
