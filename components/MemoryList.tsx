'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Ellipsis } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Memory {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  isPublic: boolean
}

export default function MemoryList({ allMemories }: { allMemories: Memory[] }) {
  const [filter, setFilter] = useState<"all" | "private" | "public">("all")

  const filteredMemories = allMemories.filter(memory => {
    if (filter === "all") return true
    if (filter === "private") return !memory.isPublic
    if (filter === "public") return memory.isPublic
  })

  // Helper for empty state messages
  const getEmptyStateMessage = () => {
    if (allMemories.length === 0) {
      return {
        title: "No Memories Yet.",
        description: "Start storing your memories and relive your best moments!",
      }
    }

    if (filter === "private") {
      return {
        title: "No Private Memories",
        description: "Some moments are just for you — start adding your private memories.",
      }
    }

    if (filter === "public") {
      return {
        title: "No Public Memories",
        description: "Make some memories and share it with world.",
      }
    }

    return {
      title: "No Memories Found",
      description: "Try switching the filter or add a new memory.",
    }
  }

  const emptyState = getEmptyStateMessage()

  return (
    <Card className="bg-[#fa9fb5] text-[#7a0177] font-semibold">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Your Memories</CardTitle>
        <div className="flex flex-wrap gap-2 mt-4">
          {["all", "private", "public"].map(type => (
            <button
              key={type}
              className={`rounded-full px-4 py-1 text-sm ${
                filter === type ? "bg-white text-[#7a0177]" : "bg-pink-100 hover:bg-white"
              }`}
              onClick={() => setFilter(type as any)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm sm:text-base">
          {filteredMemories.length === 0
            ? emptyState.title
            : `You have ${filteredMemories.length} ${
                filteredMemories.length === 1 ? "memory" : "memories"
              }`}
        </p>
      </CardContent>

      <div>
        {filteredMemories.length === 0 ? (
          <Card className="mx-5 bg-[#faaabe] mb-6 text-[#7a0177]">
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
              <h3 className="text-xl font-medium">{emptyState.title}</h3>
              <p className="text-center max-w-md text-sm">{emptyState.description}</p>
              <Link href="/memories/new">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer">Create Memory</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="text-[#7a0177] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 mb-6">
            {filteredMemories.map((memory) => (
              <Link key={memory.id} href={`/memories/${memory.id}`}>
                <Card className="h-full bg-[#f768a1] text-[#7a0177] hover:shadow-lg transition-shadow">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="line-clamp-1 text-lg">{memory.title}</CardTitle>
                    <Ellipsis className="w-5 h-5" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-2">{memory.description}</p>
                    <div className="flex items-center text-sm text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(memory.startDate).toLocaleDateString()} -{" "}
                      {new Date(memory.endDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
