import { Resend } from "resend"

const resend = new Resend(
  import.meta.env
 .VITE_RESEND_API_KEY

)

export async function sendHospitalEmail(recipient:string,hospitals:any[]){
   const hospitalList = hospitals.map((h)=>
   `<li>
      ${h.name}-
      ${h.address}
    </li>`
).join("")

    try{
       await resend.emails.send({
       from:"carefinder@resend.dev",
       to:recipient,
       subject:"CareFinder Hospital List",
       html:
   `<h1>
       Selected Hospitals
    </h1>

    <ul>
      ${hospitalList}
    </ul>`
})

  alert(
    "Email sent!"
  )
 }catch(error){

console.log(error)

alert("Failed to send email")
}
}