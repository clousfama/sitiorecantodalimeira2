
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const videoPath = path.join(process.cwd(), 'public', 'videos', 'hero-video.mp4');
    
    if (!fs.existsSync(videoPath)) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
      };
      
      return new NextResponse(file as any, {
        status: 206,
        headers,
      });
    } else {
      const file = fs.createReadStream(videoPath);
      const headers = {
        'Content-Length': fileSize.toString(),
        'Content-Type': 'video/mp4',
      };
      
      return new NextResponse(file as any, {
        status: 200,
        headers,
      });
    }
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
