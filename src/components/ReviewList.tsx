

type Props={
  reviews:any[]
}

export default function ReviewList({reviews}:Props){

     return(
        <div>
           {reviews.map((review)=>(
            <div
              key={review.id}
              className="border p-4 rounded mb-3">
               <p className="font-bold">   
               ⭐{review.rating}
               </p>
                <p>
                  {review.review_text}
               </p>
            </div>)
        )}
       </div>)
}
