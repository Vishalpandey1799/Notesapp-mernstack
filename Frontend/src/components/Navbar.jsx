import { UserCircle } from "lucide-react";
import Search from "./Search";
import { useNavigate } from "react-router-dom";
import useApiStore from "../StoreApi.js/ApiCall.js";
import { useEffect } from "react";

export default function Navbar() {
  const { currentUser, validUser} = useApiStore();
  const navigate = useNavigate();

  useEffect(() => {
    validUser(); 
  }, []);
 
  if (!currentUser) return null;

  return (
    <nav className="relative flex flex-wrap justify-between items-center px-6 md:px-10 lg:px-16 py-3 bg-gray-800 shadow-md">
      {/* Logo */}
      <h1 className="text-xl font-bold text-amber-200">Writelt</h1>

     
      <div className="w-full sm:w-[300px] mt-3 sm:mt-0">
        <Search />
      </div>
 
      <div className="absolute top-3 right-6 sm:relative sm:top-0 sm:right-0">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          {currentUser.profilePic ? (
            <img
              src={currentUser.profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <UserCircle className="w-10 h-10 text-gray-500" />
          )}
       
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
      </div>
    </nav>
  );
}
