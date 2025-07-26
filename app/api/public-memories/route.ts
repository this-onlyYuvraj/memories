// /api/public-memories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET() {
  try {
    const publicMemories = await prisma.memory.findMany({
      where: {
        isPublic: true,
        latitude: { not: null },
        longitude: { not: null },
        photos: {
          some: {
            imageUrl: { not: '' },
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        latitude: true,
        longitude: true,
        startDate: true,
        endDate: true,
        user: true,
        photos: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    const transformed = publicMemories.map((memory) => ({
      id: memory.id,
      title: memory.title,
      description: memory.description,
      location: memory.location,
      lat: memory.latitude!,
      lng: memory.longitude!,
      photos: memory.photos.map((p) => p.imageUrl),
      startDate: memory.startDate,
      endDate: memory.endDate,
      user: {
        name: memory.user?.name || 'Anonymous'
      }
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('[PUBLIC_MEMORIES_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch public memories.' },
      { status: 500 }
    );
  }
}
