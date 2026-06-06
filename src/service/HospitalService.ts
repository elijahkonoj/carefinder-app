import { supabase } from "./supabase"

type CreateHospitalData = {
  name: string
  address: string
  city: string
  lga: string
  phone: string
  email: string
  ownership_type: string
  specialities: string[]
  description_markdown: string
  latitude: number
  longitude: number
  facility_image?: string
  rating_average?: number
  created_by?: string
}


export async function createHospital(hospital: CreateHospitalData) {
  const { data, error } = await supabase
    .from("hospitals")
    .insert([hospital])
    .select()

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export async function getHospitals() {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*")

  if (error) {
    console.log(error)
    return []
  }
  console.log("GET HOSPITALS DATA:", data)
  console.log("GET HOSPITALS ERROR:", error)
  return data
}


export async function getNearbyHospitals(   
    latitude: number,
    longitude: number,
    radius: number = 10
) {
    console.log("getNearbyHospitals called")
    const { data, error } = await supabase.rpc("nearby_hospitals", {
        lat: latitude,
        lng: longitude,
        radius_km: radius
    })
    if (error) {
        console.log(error)
        return []
    }
    console.log("nearby data:", data)
    console.log("nearby error:", error)
    return data || []
}

export async function getHospitalById(id: string) {
    const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("id", id)
        .single()
    if (error) {
        console.log(error)
        return null
    }
    return data
}

export async function getHospitalsReviews(hospitalId: string) {
    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("hospital_id", hospitalId)
        .eq("approved", true)
    if (error) {
        console.log(error)
        return []
    }
    return data
}

export async function submitReview(
    hospitalId: string,
    rating: number,
    reviewText: string,
    userId: string
) {
    const { data, error } = await supabase
        .from("reviews")
        .insert([
            {
                hospital_id: hospitalId,
                rating,
                text: reviewText,
                user_id: userId
            }
        ])
    if (error) {
        console.log(error)
        return null
    }
    return data
}

export async function getAverageRating(hospitalId: string): Promise<string> {
    const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("hospital_id", hospitalId)
        .eq("approved", true)   
    if (error) {
        console.log(error)
        return "0"
    }
    if(!data.length) {
        return "0"
    }
    const sum = data.reduce((acc, review) => acc + review.rating, 0)
    return (sum / data.length).toFixed(1)    
    
}

export async function updateHospital(
  id: string,
  hospital: any
) {
  const { data, error } = await supabase
    .from("hospitals")
    .update(hospital)
    .eq("id", id)
    .select()

  if (error) throw error

  return data
}

export async function deleteHospital(
  id: string
) {
  const { error } = await supabase
    .from("hospitals")
    .delete()
    .eq("id", id)

  if (error) throw error
}
