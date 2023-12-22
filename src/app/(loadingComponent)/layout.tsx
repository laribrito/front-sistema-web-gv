'use client'
import LoadingScreen from "@/components/LoadingScreen";
import { useComponentsContext } from "@/context/componentsContext";

export default function DashboardModel({children}: { children: React.ReactNode}) {
  const { isloading } = useComponentsContext()

  return (
    <>        
      {children}
      {isloading && <LoadingScreen/>}
    </>
  )
}