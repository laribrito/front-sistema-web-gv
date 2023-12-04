import {Inter} from "next/font/google"
import "./globals.css"
import { Providers } from "./Providers"

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

const fontPadrao = Inter({ subsets: ['latin'] })

export default function RootLayout({children}: { children: React.ReactNode}) {
    return (
      <html lang="pt-br" className={fontPadrao.className}>
        <body>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    )
}
