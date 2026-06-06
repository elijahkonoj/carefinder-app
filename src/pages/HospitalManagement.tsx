import { useEffect, useState } from "react"
import { getHospitals } from "../service/HospitalService"
import { Link } from "react-router-dom"
import { deleteHospital } from "../service/HospitalService"



export default function HospitalManagement() {

  const [hospitals, setHospitals] = useState<any[]>([])

  useEffect(() => {

    async function load() {

      const data = await getHospitals()

      setHospitals(data)

    }

    load()

  }, [])

  async function handleDelete(id: string) {

  const confirmed = window.confirm("Delete this hospital?" )

  if (!confirmed) return

  await deleteHospital(id)

  setHospitals((prev) =>
    prev.filter(
      (h) => h.id !== id
    )
  )
}

 

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Manage Hospitals
      </h1>

      {hospitals.map((hospital) => (

        <div
          key={hospital.id}
          className="border p-4 mb-2 rounded"
        >
          <h2>{hospital.name}</h2>
          <Link
            to={`/admin/hospitals/${hospital.id}/edit`}
            className="text-blue-500"
        >
             Edit
         </Link>
         <button
            onClick={() =>
            handleDelete(hospital.id)
  }
            className="text-red-500 ml-4">
            Delete
        </button>
        
        </div>

      ))}

    </div>
  )
}