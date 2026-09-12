import { detailHandlers } from '@/lib/content-api'
import { projectsResource } from '@/lib/content-resources'

export const { GET, PATCH, DELETE } = detailHandlers(projectsResource)
