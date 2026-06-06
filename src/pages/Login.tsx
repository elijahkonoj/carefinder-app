import { useState, useEffect } from "react"
import { supabase } from "../service/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
  async function test() {
    const session = await supabase.auth.getSession()
    console.log("SESSION:", session)
  }

  test()
}, [])

  async function handleLogin() {
    const {data,error} = await supabase.auth.signInWithPassword({
      email,
      password
    })
    console.log("LOGIN DATA:", data)
    console.log("LOGIN ERROR:", error)
    if (error) {
      alert("Login failed: " + error.message)
    } else {
      alert("Login successful!")
    }
   setEmail("")
   setPassword("")

  } 

  async function handleSignup() {
    const {error} = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      alert("Signup failed: " + error.message)
    } else {
      alert("Signup successful!")
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          autoComplete="off"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleLogin}
      >
        Login
      </button>
      <button
        className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSignup}
      >
        Signup
      </button>
    </div>
  )
}
