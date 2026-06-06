import { supabase } from "./supabase"

export async function addFavourite(hospitalId: string) {
    const { data: userData } = await supabase.auth.getUser()

    const user = userData.user

  console.log("USER:", user)
  console.log("HOSPITAL ID:", hospitalId)

  if (!user) throw new Error("Not logged in")

  const { error } = await supabase
    .from("favorites")
    .insert([
      {
        user_id: user.id,
        hospital_id: hospitalId,
      },
    ])
  console.log("INSERT ERROR:", error)
  if (error) throw error
}

export async function removeFavourite(hospitalId: string) {
    const { data: userData } = await supabase.auth.getUser()

    const user = userData.user

  if (!user) return

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("hospital_id", hospitalId)

  if (error) throw error
}

export async function getFavourites() {

  const { data: userData } = await supabase.auth.getUser()

  const user = userData.user

  if (!user) return []

  const { data, error } =
    await supabase
      .from("favorites")
      .select(`
        hospital_id,
        hospitals(*)
      `)

  if (error) throw error
  console.log(data)
  return data
}