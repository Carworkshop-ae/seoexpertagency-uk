import { detailHandlers } from '@/lib/content-api'
import { seoPagesResource } from '@/lib/content-resources'

export const { GET, PATCH, DELETE } = detailHandlers(seoPagesResource)
