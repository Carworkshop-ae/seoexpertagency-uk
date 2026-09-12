import { detailHandlers } from '@/lib/content-api'
import { industriesResource } from '@/lib/content-resources'

export const { GET, PATCH, DELETE } = detailHandlers(industriesResource)
