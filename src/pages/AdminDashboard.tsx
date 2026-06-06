import { Link } from "react-router-dom"

export default function AdminDashboard() {

    return (
        <div className="p-6"> 
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>
          <Link to="/admin/create"
           className="block mt-4 text-blue-500">
             Create Hospital
          </Link>
          <Link to="/admin/hospitals"
             className="block mt-2 text-blue-500">
              Manage Hospitals
          </Link>
          <Link to="/favourites"
             className="block mt-2 text-blue-500">
             My Favourites
          </Link>
        </div>
        
    )
}