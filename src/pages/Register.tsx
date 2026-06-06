import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../service/supabase"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
        })

      if (error) throw error

      alert("Registration successful!")

      console.log(data)

      navigate("/login")
    } catch (error) {
      console.error(error)
      alert("Registration failed")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Register
      </h1>

      <form onSubmit={handleRegister}
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  )
}