
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CafePay Wallet',
    short_name: 'CafePay',
    description: 'Smart student spending with intelligent meal plan and expense management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#110B13',
    theme_color: '#EF1AB8',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
