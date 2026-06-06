import { useState } from "react"
import { createHospital } from "../service/HospitalService"
import { z } from "zod"
import MDEditor from "@uiw/react-md-editor"
import { uploadHospitalImage } from "../service/storageService"
import { supabase } from "../service/supabase"

const hospitalSchema = z.object({
  name: z.string().min(3, "Hospital name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  lga: z.string().min(2, "LGA is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Invalid email"),
  specialities: z.array(z.string()).min(1, "At least one speciality is required"),
  description_markdown: z.string().min(10, "Description is required"),
  ownership_type: z.enum(["public", "private"]),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
})

export default function CreateHospital() {
   const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    lga: "",
    phone: "",
    email: "",
    ownership_type: "",
    specialities: [] as string[],
    description_markdown: "",
    latitude: "",
    longitude: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    console.log("FORM SUBMITTED")
  e.preventDefault()

  try {
    console.log("BEFORE VALIDATION")
    const validatedData = hospitalSchema.parse(formData)
    console.log("AFTER VALIDATION")
    setErrors({})

    let imageUrl = ""

    if (imageFile) {
      imageUrl = await uploadHospitalImage(imageFile)
    }

    const { data: userData } = await supabase.auth.getUser()

    const user = userData.user

    const hospitalData = {
      ...validatedData,
      rating_average: 0,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      ownership_type: formData.ownership_type.toLowerCase(),
      facility_image: imageUrl,
      specialities: formData.specialities,
      description_markdown: formData.description_markdown, 
      created_by: user?.id, 
    }

    await createHospital(hospitalData)

    alert("Hospital created successfully!")

    setFormData({
      name: "",
      address: "",
      city: "",
      lga: "",
      phone: "",
      email: "",
      ownership_type: "",
      specialities: [],
      description_markdown: "",
      latitude: "",
      longitude: "",
    })

    setImageFile(null)

  } catch (error) {
    console.log("VALIDATION ERROR:", error)
    if (error instanceof z.ZodError) {
    console.log("ZOD ISSUES:", error.issues)
      const fieldErrors: Record<string, string> = {}

      error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })

      setErrors(fieldErrors)

    } else {

      console.error(error)
      alert("Failed to create hospital")

    }
  }
}

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Create Hospital
      </h1>
<form onSubmit={handleSubmit}
className="space-y-4">

  <input
    type="text"
    placeholder="Hospital Name"
    className="border p-2 w-full"
    value={formData.name}
    onChange={(e) =>
      setFormData({
        ...formData,
        name: e.target.value,
      })
    }
  />
  {errors.name && (
  <p className="text-red-500">
    {errors.name}
  </p>
)}
  <select
  className="border p-2 w-full"
  value={formData.ownership_type}
  onChange={(e) =>
    setFormData({
      ...formData,
      ownership_type: e.target.value,
    })
  }
>
  <option value="">
    Select Ownership Type
  </option>

  <option value="public">
    Public
  </option>

  <option value="private">
    Private
  </option>
</select>

  <input
    type="text"
    placeholder="Address"
    className="border p-2 w-full"
    value={formData.address}
    onChange={(e) =>
      setFormData({
        ...formData,
        address: e.target.value,
      })
    }
  />

  {errors.address && (
  <p className="text-red-500">
    {errors.address}
  </p>
)}

  <input
    type="text"
    placeholder="City"
    className="border p-2 w-full"
    value={formData.city}
    onChange={(e) =>
      setFormData({
        ...formData,
        city: e.target.value,
      })
    }
  />
{errors.city && (
  <p className="text-red-500">
    {errors.city}
  </p>
)}

<input
    type="text"
    placeholder="LGA"
    className="border p-2 w-full"
    value={formData.lga}
    onChange={(e) =>
      setFormData({
        ...formData,
        lga: e.target.value,
      })
    }
  />
{errors.lga && (
  <p className="text-red-500">
    {errors.lga}
  </p>
)}

  <input
    type="text"
    placeholder="Phone"
    className="border p-2 w-full"
    value={formData.phone}
    onChange={(e) =>
      setFormData({
        ...formData,
        phone: e.target.value,
      })
    }
  />
{errors.phone && (
  <p className="text-red-500">
    {errors.phone}
  </p>
)}

<input
    type="text"
    placeholder="email"
    className="border p-2 w-full"
    value={formData.email}
    onChange={(e) =>
      setFormData({
        ...formData,
        email: e.target.value,
      })
    }
  />
  {errors.email && (
  <p className="text-red-500">
    {errors.email}
  </p>
)}

<input
  type="text"
  placeholder="Specialities (comma separated)"
  className="border p-2 w-full"
  value={formData.specialities.join(", ")}
  onChange={(e) =>
    setFormData({
      ...formData,
      specialities: e.target.value.split(",").map((s) => s.trim()),
    })
  }
/>
<input
  type="number"
  step="any"
  placeholder="Latitude"
  value={formData.latitude}
  onChange={(e) =>
    setFormData({
      ...formData,
      latitude: e.target.value,
    })
  }
/>

<input
  type="number"
  step="any"
  placeholder="Longitude"
  value={formData.longitude}
  onChange={(e) =>
    setFormData({
      ...formData,
      longitude: e.target.value,
    })
  }
/>
<MDEditor
  value={formData.description_markdown}
  onChange={(value) =>
    setFormData({
      ...formData,
      description_markdown: value || "",
    })
  }
/>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setImageFile(
      e.target.files?.[0] || null
    )
  }
/>

<button
  type="submit"
  className="bg-blue-500 text-white px-4 py-2 rounded"
> Create Hospital
</button>
</form>
    </div>
  )
}