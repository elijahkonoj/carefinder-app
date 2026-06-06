import { supabase } from "./supabase"

export async function uploadHospitalImage(
  file: File
) {
  const fileName = `${Date.now()}-${file.name}`

  const { error } =
    await supabase.storage
      .from("hospital-images")
      .upload(fileName, file)

  if (error) throw error

  const { data } =
    supabase.storage
      .from("hospital-images")
      .getPublicUrl(fileName)

  return data.publicUrl
}