import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { esESLocale } from '@sanity/locale-es-es'
import { schemaTypes } from './schemas'
import { myStructure } from './structure'

export default defineConfig({
  name: 'testing-calibrations',
  title: 'Testing Calibrations S.A.C.',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  basePath: '/studio',
  plugins: [structureTool({ structure: myStructure }), visionTool(), esESLocale()],
  schema: { types: schemaTypes },
})
