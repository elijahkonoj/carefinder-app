import { useEffect, useState } from "react"
import { getHospitals } from "../service/HospitalService"
import HospitalMap from '../components/HospitalMap'
import useLocation from "../hooks/useLocation"
import { Link, useSearchParams } from "react-router-dom"
import { getNearbyHospitals } from "../service/HospitalService"
import { exportHospitals } from "../service/exportService"
import EmailShareForm from "../components/emailShareForm"
import { supabase } from "../service/supabase"


export default function Home() {
  const [hospitals, setHospitals] = useState<any[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ["name", "email", "address", "phone", "specialities", "rating"]  
  )
  
  const userLocation = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
  async function loadHospitals() {
    try {
      if (userLocation?.latitude && userLocation?.longitude) {

        console.log("LOADING NEARBY...")

        const nearbyHospitals = await getNearbyHospitals(
          userLocation.latitude,
          userLocation.longitude,
          10
        )

        console.log("NEARBY RESULT:", nearbyHospitals)

        if (nearbyHospitals && nearbyHospitals.length > 0) {
          setHospitals(nearbyHospitals)
        } else {
          console.log(
            "No nearby hospitals found. Loading all hospitals."
          )

          const allHospitals = await getHospitals()

          console.log("ALL HOSPITALS:", allHospitals)

          setHospitals(allHospitals || [])
        }

      } else {

        console.log("LOADING ALL")

        const allHospitals = await getHospitals()

        console.log("ALL HOSPITALS:", allHospitals)

        setHospitals(allHospitals || [])
      }

    } catch (error) {
      console.error("Error loading hospitals:", error)
      setHospitals([])
    }
  }

  loadHospitals()

}, [userLocation])

 


  const filtered = hospitals.filter((h) =>
    h?.name?.toLowerCase()?.includes(search.toLowerCase())
)
      
async function copyShareLink(){
      await navigator
      .clipboard
      .writeText(

       window.location.href

 )
  setCopied(true)

  setTimeout(()=>{

  setCopied(false)

 },2000)

}



useEffect(() => {

  async function checkUser() {

    const { data, error } = await supabase.auth.getUser()

    console.log("USER:", data.user)

    console.log("ERROR:", error)

  }

  checkUser()

}, [])
console.log("Hospitals:", hospitals)
console.log("Filtered:", filtered)

  return (
    <>
    
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Hospitals
      </h1>
      <div className="mb-4">
        <h2>Export Column</h2>
        {["name", "email", "address", "phone", "specialities", "rating"
         ].map((column) => (
          <label key={column} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedColumns.includes(column)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedColumns([...selectedColumns, column])
                } else {
                  setSelectedColumns(selectedColumns.filter((c) => c !== column))
                }
              }}
            />
            <span>{column}</span>
          </label>
        ))}
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => exportHospitals(filtered, search, selectedColumns)}
        >
          Export CSV
        </button>
        <EmailShareForm hospitals={filtered}/>
      </div>
      
      <div className="space-y-3">
        {filtered.map((h) => (
          
          <Link to={`/hospital/${h.id}`}
            key={h.id}
            className="p-4 border rounded"
          >
            <h2 className="font-semibold">
              {h.name}
            </h2>

            <p>{h.city}</p>
            {h.facility_image && (
              <img
                src={h.facility_image}
                alt={h.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <p>{h.address}</p>
            <p>{h.phone}</p>  
            <p>{h.distance_km}</p>
          </Link>
))}
      </div>
      <HospitalMap hospitals={filtered} userLocation={userLocation} />

       <input
           className="border p-2 mb-4 w-full mt-4"
           placeholder="Search hospitals..."
           value={search}
           onChange={(e) => {
            const value = e.target.value
            setSearch(value)
            setSearchParams({ search: e.target.value })
           }}/>

      <button onClick={copyShareLink} 
        className="px-4 py-2 bg-green-500 text-white rounded">
        {copied ? "Link Copied!" : "Copy Share Link"}
      </button>
    </div>
  </>
  )
}