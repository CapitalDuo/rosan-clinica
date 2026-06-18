import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata = {
  title: 'Rosan — Clínica Integrativa',
  description: 'Sistema de gestão para clínicas médicas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="font-inter min-h-full">
        {children}
      </body>
    </html>
  )
}
