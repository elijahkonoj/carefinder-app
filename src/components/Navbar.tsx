import { NavLink, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../service/supabase"


export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState("")

  const navigate = useNavigate()
 
  useEffect(() => {
  async function loadUser() {
    console.log("=== LOAD USER START ===")

    const { data, error } = await supabase.auth.getUser()

    console.log("AUTH ERROR:", error)
    console.log("AUTH DATA:", data)

    const currentUser = data.user

    console.log("CURRENT USER:", currentUser)

    setUser(currentUser)

    if (!currentUser) {
      console.log("RETURNING - NO USER")
      return
    }

    console.log("RUNNING ROLE QUERY NOW")

    try {
      const result = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single()

      console.log("FULL QUERY RESULT:", result)

      setRole(result.data?.role || "")
    } catch (err) {
      console.error("QUERY CRASHED:", err)
    }

    console.log("=== LOAD USER END ===")
  }

  loadUser()
}, [])


  

  async function handleLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error)
    return
  }

  navigate("/login")
  setUser(null)
}

const username = user?.email?.split("@")[0] || "Guest"


useEffect(() => {
  const { data: { subscription },} = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      setUser(session?.user ?? null)

      if (!session?.user) {


        console.log("AUTH LISTENER USER:", session.user.id)
    setRole("")
  }

    }
  )

  return () => subscription.unsubscribe()
}, [])
console.log("NAVBAR USER:", user)
console.log("ROLE:", role)

return (
  <nav className="bg-blue-600 text-white p-4">
    <div className="flex justify-between items-center">

      <div className="flex gap-4">
        <NavLink to="/"
          className={({ isActive }) => 
          isActive ? "font-bold underline" : ""}>Home</NavLink>

        {user ? (
    <>
      <NavLink to="/favourites"
      className={({ isActive }) => 
          isActive ? "font-bold underline" : ""}>Favourites</NavLink>

      <NavLink to="/dashboard"
      className={({ isActive }) => 
          isActive ? "font-bold underline" : ""}>Dashboard</NavLink>
          <NavLink
        to="/profile"
        className={({ isActive }) => 
          isActive ? "font-bold underline" : ""}
>         Profile
       </NavLink>
      {role === "admin" && (
        <NavLink to="/admin"
        className={({ isActive }) => 
          isActive ? "font-bold underline" : ""}>Admin</NavLink>
      )}
    </>
  ) : (
    <>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
  
    </>
  )}
</div>
     {user && (
    <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
    
      <span>Welcome, {username}</span>
      

  <span className="px-2 py-1 text-xs bg-gray-200 text-black rounded">
    {role.toUpperCase()}
  </span>
</div>

    <button
      onClick={handleLogout}
      className="bg-red-500 px-3 py-1 rounded"
    >
      Logout
    </button>
  </div>
)}

    </div>
  </nav>
)
}