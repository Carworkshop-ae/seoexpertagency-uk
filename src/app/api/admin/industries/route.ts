import { listHandler, createHandler } from '@/lib/content-api'
import { industriesResource } from '@/lib/content-resources'

export const GET = listHandler(industriesResource)
export const POST = createHandler(industriesResource)
