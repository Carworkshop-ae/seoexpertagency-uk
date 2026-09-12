import { detailHandlers } from '@/lib/content-api'
import { locationsResource } from '@/lib/content-resources'

export const { GET, PATCH, DELETE } = detailHandlers(locationsResource)
