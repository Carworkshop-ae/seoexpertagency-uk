import type { ContentResource } from '@/lib/content-api'
import {
  CreateServiceSchema, UpdateServiceSchema,
  CreateIndustrySchema, UpdateIndustrySchema,
  CreateProjectSchema, UpdateProjectSchema,
  CreateLocationSchema, UpdateLocationSchema,
  CreateSeoPageSchema, UpdateSeoPageSchema,
} from '@/lib/schemas/content'

// One definition per CMS-managed content type. The API routes and admin
// modules are generated from these, so adding a fifth type means adding a
// row here plus a form component — not another copy of the CRUD stack.

const LIST_COLUMNS = 'id, slug, status, sort_order, updated_at'

export const servicesResource: ContentResource<typeof CreateServiceSchema, typeof UpdateServiceSchema> = {
  table: 'services',
  collection: 'services',
  revalidateAs: 'service',
  createSchema: CreateServiceSchema,
  updateSchema: UpdateServiceSchema,
  listColumns: `${LIST_COLUMNS}, name, short_description, seo_title, seo_description`,
  titleColumn: 'name',
}

export const industriesResource: ContentResource<typeof CreateIndustrySchema, typeof UpdateIndustrySchema> = {
  table: 'industries',
  collection: 'industries',
  revalidateAs: 'industry',
  createSchema: CreateIndustrySchema,
  updateSchema: UpdateIndustrySchema,
  listColumns: `${LIST_COLUMNS}, name, short_description, seo_title, seo_description`,
  titleColumn: 'name',
}

export const projectsResource: ContentResource<typeof CreateProjectSchema, typeof UpdateProjectSchema> = {
  table: 'projects',
  collection: 'projects',
  revalidateAs: 'project',
  createSchema: CreateProjectSchema,
  updateSchema: UpdateProjectSchema,
  listColumns: `${LIST_COLUMNS}, title, client, industry, summary, seo_title, seo_description`,
  titleColumn: 'title',
}

export const locationsResource: ContentResource<typeof CreateLocationSchema, typeof UpdateLocationSchema> = {
  table: 'locations',
  collection: 'locations',
  revalidateAs: 'location',
  createSchema: CreateLocationSchema,
  updateSchema: UpdateLocationSchema,
  listColumns: `${LIST_COLUMNS}, name, region, country_code, seo_title, seo_description`,
  titleColumn: 'name',
}

export const seoPagesResource: ContentResource<typeof CreateSeoPageSchema, typeof UpdateSeoPageSchema> = {
  table: 'seo_pages',
  collection: 'seo_pages',
  revalidateAs: 'seo_page',
  createSchema: CreateSeoPageSchema,
  updateSchema: UpdateSeoPageSchema,
  listColumns: `${LIST_COLUMNS}, title:headline, seo_title, faq_json, location:locations(name), creator:users!created_by(full_name)`,
  titleColumn: 'headline',
  tracksCreator: true,
}
