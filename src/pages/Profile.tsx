import { useEffect, useState } from "react"
import { supabase } from "../service/supabase"

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [hospitalCount, setHospitalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: userData } = await supabase.auth.getUser()

        const user = userData.user
        console.log("PROFILE USER:", user)
        if (!user) {
          
          setLoading(false)
          return
        }


        const { data: profileData, error: profileError,} = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

          

      console.log("PROFILE DATA:", profileData)
      

        if (profileError) {
          console.error("Profile Error:", profileError)
          setLoading(false)
          return
        }

        setProfile(profileData)

        
        const { count: favCount, error: favError } = await supabase
            .from("favorites")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq("user_id", user.id)

        if (favError) {
          console.error("Favorites Count Error:", favError)
        }

        setFavoriteCount(favCount || 0)

        
        const { count: reviewsCount, error: reviewsError,} = await supabase
          .from("reviews")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id)

        if (reviewsError) {
          console.error("Reviews Count Error:", reviewsError)
        }

        setReviewCount(reviewsCount || 0)

        const { count: hospitalsCount,error: hospitalsError,} = await supabase
          .from("hospitals")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("created_by", user.id)

        if (hospitalsError) {
          console.error(
            "Hospitals Count Error:",
            hospitalsError
          )
        }

        setHospitalCount(hospitalsCount || 0)
      } catch (error) {
        console.error("Profile Load Error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!profile) {

    return (
      <div className="p-6">
        <p>Profile not found.</p>
      </div>
    )
    
  }
  

  const username = profile.email?.split("@")[0] || "User"
  


  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="border rounded-lg p-6 shadow">

        <div className="flex items-center gap-4 mb-4">

          <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
            {username.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Welcome, {username}
            </h2>

            <p>{profile.email}</p>

            <span
              className={`px-2 py-1 rounded text-sm ${
                profile.role === "admin"
                  ? "bg-yellow-300 text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              {profile.role?.toUpperCase()}
            </span>
          </div>

        </div>

        <div className="mt-4 space-y-2">
          <p>
            <strong>Member Since:</strong>{" "}
            {new Date(
              profile.created_at
            ).toLocaleDateString()}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <div className="border rounded-lg p-4 text-center shadow">
          <h3 className="text-3xl font-bold">
            {favoriteCount}
          </h3>
          <p>Favorites</p>
        </div>

        <div className="border rounded-lg p-4 text-center shadow">
          <h3 className="text-3xl font-bold">
            {reviewCount}
          </h3>
          <p>Reviews</p>
        </div>

        {profile.role === "admin" && (
          <div className="border rounded-lg p-4 text-center shadow">
            <h3 className="text-3xl font-bold">
              {hospitalCount}
            </h3>
            <p>Hospitals Created</p>
          </div>
        )}

      </div>

    </div>
  )
}