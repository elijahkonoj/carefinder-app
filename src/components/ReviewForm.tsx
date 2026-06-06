import { useState } from "react"
import { submitReview } from "../service/HospitalService"

type Props = {
    hospitalId:string
    userId:string

}

export default function ReviewForm({hospitalId,userId}:Props){
    const [rating, setRating] = useState(5)
    const [reviewText, setReviewText] = useState("")

    async function handleSubmit() {
        await submitReview(hospitalId, rating, reviewText, userId)
    
        setReviewText("")
    }

    return(
        <div>
            <input
                type="number"
                max={1}
                min={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))} 
            />
            <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
            />
            <button onClick={handleSubmit}>
                Submit Review
            </button>   
        </div>
    )
}
