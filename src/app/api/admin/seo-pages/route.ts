import { listHandler, createHandler } from '@/lib/content-api'
import { seoPagesResource } from '@/lib/content-resources'

export const GET = listHandler(seoPagesResource)
export const POST = createHandler(seoPagesResource)
