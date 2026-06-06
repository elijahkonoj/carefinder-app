import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {getHospitalById,updateHospital} from "../service/HospitalService"

export default function EditHospital() {

  const { id } = useParams()

  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {

    async function loadHospital() {

      if (!id) return

      const hospital = await getHospitalById(id)

      setFormData(hospital)

    }

    loadHospital()

  }, [id])

  async function handleSubmit( e: React.FormEvent) {

    e.preventDefault()

    if (!id) return

    await updateHospital(id,formData)

    alert("Hospital updated!")

  }

  if (!formData)
    return <p>Loading...</p>

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4"
    >
      <input
        className="border p-2 w-full"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  )
}