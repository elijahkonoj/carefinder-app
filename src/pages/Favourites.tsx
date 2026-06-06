import { useEffect, useState } from "react"
import { getFavourites } from "../service/FavouriteService"

export default function Favourites() {

  const [favourites, setFavourites] = useState<any[]>([])

  useEffect(() => {

    async function load() {

      const data = await getFavourites()
       console.log("FAVORITES:", data)
        setFavourites(data)

    }

    load()

  }, [])

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        My Favorite Hospitals
      </h1>

      {favourites.map((fav) => (

        <div
          key={fav.hospital_id}
          className="border p-4 mb-2"
        >
          <h2>
            {fav.hospitals.name}
          </h2>
        </div>

      ))}

    </div>
  )
}