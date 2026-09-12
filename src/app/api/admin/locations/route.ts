import { listHandler, createHandler } from '@/lib/content-api'
import { locationsResource } from '@/lib/content-resources'

export const GET = listHandler(locationsResource)
export const POST = createHandler(locationsResource)
