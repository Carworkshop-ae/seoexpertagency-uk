import { detailHandlers } from '@/lib/content-api'
import { servicesResource } from '@/lib/content-resources'

export const { GET, PATCH, DELETE } = detailHandlers(servicesResource)
