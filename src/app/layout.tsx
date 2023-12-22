import {Poppins} from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/authContext"
import { Toaster } from "react-hot-toast"
import { OrderProvider } from "@/context/orderContext"
import { ServerDataProvider } from "@/context/serverDataContext"
import LoadingScreen from "@/components/LoadingScreen"
import { ComponentsProvider, useComponentsContext } from "@/context/componentsContext"

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

const fontPadrao = Poppins({ subsets: ['latin'], weight: '400'})

export default function RootLayout({children}: { children: React.ReactNode}) {
    return (
      <html lang="pt-br" className={fontPadrao.className}>
        <body>
        <AuthProvider>
          <OrderProvider>
            <ServerDataProvider>
              <ComponentsProvider>
                {children}
              </ComponentsProvider>
            </ServerDataProvider>
          </OrderProvider>
        </AuthProvider>
        <Toaster position="top-right" />
        </body>
      </html>
    )
}
