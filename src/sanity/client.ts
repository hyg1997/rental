import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

// Use a valid placeholder so the client instantiates safely even when the
// real project ID is not yet configured. Fetches will fail gracefully and
// the layout will fall back to default values.
const safeProjectId =
  projectId && /^[a-z0-9-]+$/.test(projectId) ? projectId : 'placeholder'

export const client = createClient({
  projectId: safeProjectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
