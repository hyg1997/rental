import { defineQuery } from 'groq'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteName,
    logo,
    whatsappNumber,
    email,
    address,
    navLinks[]{label, href},
    socialLinks[]{platform, url},
    footerText
  }
`)
