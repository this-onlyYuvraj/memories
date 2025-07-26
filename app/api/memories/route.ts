// app/api/memories/route.ts
import { auth } from "@/auth"
import { getCountryFromCoordinates } from "@/lib/actions/geoCode"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized Please Login", { status: 401 })
    }


    const memories = await prisma.memory.findMany({
      where: {
        userId: session.user?.id,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        location: true,
        latitude: true,
        longitude: true,
      },
    })

    const transformed = await Promise.all(
      memories.map(async (mem) => {
        const geo = await getCountryFromCoordinates(mem.latitude!, mem.longitude!)
        return {
          name: `${mem.location} - ${geo.formattedAddress}`,
          lat: mem.latitude,
          lng: mem.longitude,
          country: geo.country,
        }
      })
    )

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("GET /api/memories error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
