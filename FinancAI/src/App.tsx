import React, { ReactNode, useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { createPageUrl } from "@/utils"
import "./index.css"
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Target,
  BrainCircuit,
  Settings,
  UserCircle,
} from "lucide-react"
import { User } from "@/entities/User"

interface LayoutProps {
  children?: ReactNode
  currentPageName?: string
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me()
        setUser(currentUser)
      } catch (e) {
        // Not logged in
      }
    }
    fetchUser()
  }, [])
  
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white">
        {/* nav, user card, etc */}
      </aside>
      <main className="flex-1 p-4">
        {children ?? <p>Welcome!</p>}
      </main>
    </div>
  )
}