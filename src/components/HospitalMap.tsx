import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

import { MapContainer,TileLayer,Marker,Popup } from "react-leaflet"

type Hospital={
        id:string
        name:string
        latitude:number
        longitude:number
        address:string
}

  type Props={
       hospitals:Hospital[]
       userLocation?:{
       latitude:number
       longitude:number
    }|null
}

export default function HospitalMap({hospitals,userLocation}:Props){
   
    return(
    <MapContainer
        center={userLocation ? [userLocation.latitude, userLocation.longitude] : [6.5244,3.3792]}
            zoom={11}
             style={{
               height:"500px",
                width:"100%"
 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map((hospital: Hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.latitude, hospital.longitude]}
        >
          <Popup>
            {hospital.name}
            <br />
            {hospital.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
