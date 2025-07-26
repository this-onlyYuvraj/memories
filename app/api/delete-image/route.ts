// app/api/delete-image/route.ts

import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { publicIds } = await req.json()

    if (!Array.isArray(publicIds)) {
      return NextResponse.json({ error: 'Invalid publicIds' }, { status: 400 })
    }

    const results = await Promise.all(
      publicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId, { invalidate: true })
      )
    )

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    console.error('Cloudinary Deletion Error:', err)
    return NextResponse.json({ error: 'Failed to delete images' }, { status: 500 })
  }
}
