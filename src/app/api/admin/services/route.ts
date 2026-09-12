import { listHandler, createHandler } from '@/lib/content-api'
import { servicesResource } from '@/lib/content-resources'

export const GET = listHandler(servicesResource)
export const POST = createHandler(servicesResource)
