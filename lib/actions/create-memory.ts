"use server"

import { auth } from "@/auth"
import { prisma } from "../prisma"
import { redirect } from "next/navigation"


export async function createMemory(formData: FormData) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Not Authenticated")
  }

  const title = formData.get("title")?.toString()
  const description = formData.get("description")?.toString()
  const location = formData.get("location")?.toString()
  const latitudeStr = formData.get("latitude")?.toString()
  const longitudeStr = formData.get("longitude")?.toString()
  const startDateStr = formData.get("startDate")?.toString()
  const endDateStr = formData.get("endDate")?.toString()
  const isPublicRaw = formData.get("isPublic")

  if (!title || !location || !description || !startDateStr || !endDateStr) {
    throw new Error("All Fields are Required")
  }

  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)
  const isPublic = isPublicRaw === "true" || isPublicRaw === "on"
  const latitude = latitudeStr ? parseFloat(latitudeStr) : null
  const longitude = longitudeStr ? parseFloat(longitudeStr) : null

  // 🔥 Extract all image data (assumed to be JSON strings)
  const photos: { url: string; publicId: string }[] = []

  for (const [key, value] of formData.entries()) {
    if (key === "images" && typeof value === "string") {
      try {
        const img = JSON.parse(value)
        photos.push(img)
      } catch (e) {
        console.error("Invalid image JSON:", value)
      }
    }
  }

  // 🔐 Create memory with related photos
  await prisma.memory.create({
    data: {
      title,
      description,
      location,
      latitude,
      longitude,
      startDate,
      endDate,
      isPublic,
      userId: session.user.id,
      photos: {
        create: photos.map((photo) => ({
          imageUrl: photo.url,
        })),
      },
    },
  })

  redirect("/memories")
}
