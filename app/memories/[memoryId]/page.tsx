import { auth } from "@/auth"
import MemoryDetailClient from "@/components/MemoryDetail"
import { prisma } from "@/lib/prisma"


export default async function MemoryDetail({
    params,
}:{
    params: Promise<{memoryId:string, photos:string}>;
}) {
    const {memoryId} = await params
    const session = await auth()
    console.log(memoryId)
    if(!session){
        return <div>Please Login</div>
    }
    const memory = await prisma.memory.findFirst({
        where: {id: memoryId, userId: session.user?.id},
        include: {photos: true}
    })

    if(!memory){
        return <div>Memory Not Found.</div>
    }

    return <MemoryDetailClient memory = {memory}/>

}