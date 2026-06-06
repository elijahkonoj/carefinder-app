import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../service/supabase"

export default function AdminRoute({children,}: {
  children: React.ReactNode
}) {

  const [loading, setLoading] = useState(true)

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {

    async function checkAdmin() {

      const {data: userData} = await supabase.auth.getUser()
    
      const user = userData.user
      

      if (!user) {
        console.log("NO USER FOUND")
        setLoading(false)

        return

      }

      const {data: profile, error} = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
        console.log("ADMIN USER:", user)
        console.log("ADMIN PROFILE:", profile)
        console.log("ADMIN ERROR:", error)

      if (profile?.role ==="admin") {

        setIsAdmin(true)

      }

      setLoading(false)

    }

    checkAdmin()

  }, [])

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    )

  }

  if (!isAdmin) {

    return (
      <Navigate to="/" />
    )

  }

  return <>{children}</>

}