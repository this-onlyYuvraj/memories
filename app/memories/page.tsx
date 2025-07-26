import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import MemoryList from "@/components/MemoryList"


export default async function MemoriesPage() {
  const session = await auth()
  if (!session) {
    return (
      <div className="h-dvh">
        <div className="flex flex-col justify-center h-full items-center ">
          <p className="text-2xl md:text-5xl text-pink-700 font-semibold">Please log in first</p>
          <button className="mt-7 px-4 text-xl py-2 bg-pink-600 hover:bg-pink-700 rounded-full text-white transition">Sign In</button>
        </div>
      </div>
      
    )
  }

  const allMemoriesRaw = await prisma.memory.findMany({
    where: { userId: session.user?.id },
    orderBy: { startDate: "desc" },
  })

  const allMemories = allMemoriesRaw.map(memory => ({
    ...memory,
    startDate: memory.startDate.toISOString(),
    endDate: memory.endDate.toISOString(),
  }))

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-700">Dashboard</h1>
        <Link href="/memories/new">
          <Button className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer text-sm sm:text-base">New Memory</Button>
        </Link>
      </div>

      <MemoryList allMemories={allMemories} />
    </div>
  )
}
