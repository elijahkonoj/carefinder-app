import { useState } from "react"

import { sendHospitalEmail }from "../service/emailService"

type Props={
  hospitals:any[]
}

export default function EmailShareForm({hospitals}:Props){

const [email, setEmail] = useState("")

async function handleSend(){
  await sendHospitalEmail(email,hospitals)
     setEmail("")
}

return(
    <div
       className ="mt-6">
        <h2 className= "font-bold mb-2">
          Share Hospitals
        </h2>

        <input type="email"
            placeholder="Recipient email"
            value={email}
            onChange={(e)=>
            setEmail(e.target.value)}
            className="border p-2 mr-2"/>

        <button
            onClick={handleSend}
            className="bg-purple-600 text-white px-4 py-2 rounded">
            Send Email
        </button>
    </div>
)}