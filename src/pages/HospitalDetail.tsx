import { useState, useEffect } from "react";
import { getHospitalsReviews, getHospitalById, getAverageRating } from "../service/HospitalService";
import ReviewList from "../components/ReviewList";
import {  useParams } from "react-router-dom";
import { supabase } from "../service/supabase";
import ReviewForm from "../components/ReviewForm";
import { addFavourite } from "../service/FavouriteService"



export default function HospitalDetail() {
    const { id } = useParams();
    const [hospital, setHospital] = useState<any | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);  
    const [rating, setRating] = useState(0);

    
    useEffect(()=>{
        async function loadHospital(){
          if(!id) return

          const hospitalData = await getHospitalById(id)
             setHospital(hospitalData)

          const reviewData = await getHospitalsReviews(id)
             setReviews(reviewData)

          const { data } = await supabase.auth.getUser()
             setUser(data.user)

          const avg = await getAverageRating(id)
             setRating(Number(avg) || 0)


        }
        loadHospital()
     },[id])
    
  async function handleFavourite() {
     try {
       console.log("Hospital ID:", hospital.id)

       await addFavourite(hospital.id)
       alert("Hospital added to favorites!")
       console.log("Favourite saved!")
  } catch (error) {
    console.error("Favourite Error:", error)
  }
}
  

if (!hospital) {
  return <p>Loading hospital...</p>}

    return(
        <div className="p-6"> 
        <h1 className="text-3xl font-bold">
          HOSPITAL DETAIL PAGE
        </h1>
        <button onClick={handleFavourite}
           className="mb-4 px-4 py-2 bg-red-500 text-white rounded">
           ❤️ Save Hospital
         </button>
         <h1 className="text-2xl font-bold">
            {hospital.name}
         </h1>

         <p>{hospital.address}</p>
         <p>{hospital.city}</p>

          <ReviewList reviews={reviews} />
          { user && id && (
            <ReviewForm hospitalId={id} userId={user.id} /> )}
          <p>⭐{rating}</p>
          <p>{reviews.length} reviews</p>
         {hospital.facility_image && (
        <img
           src={hospital.facility_image}
           alt={hospital.name}
           className="w-full h-64 object-cover rounded"
  />
      )}
       
   </div>
    )
}


 