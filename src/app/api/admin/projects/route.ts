import { listHandler, createHandler } from '@/lib/content-api'
import { projectsResource } from '@/lib/content-resources'

export const GET = listHandler(projectsResource)
export const POST = createHandler(projectsResource)
