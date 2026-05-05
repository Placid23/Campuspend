
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CafePay Wallet',
    short_name: 'CafePay',
    description: 'Smart student spending with intelligent meal plan and expense management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D080E',
    theme_color: '#EF1AB8',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
