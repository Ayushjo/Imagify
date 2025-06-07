import React from "react";
import { assets } from "../assets/assets.js";
import { use } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/App-context.jsx";
import { toast } from "react-toastify";
export const Navbar = () => {
  const userCtx = use(AppContext);

  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Link to="/">
          <img
            src={assets.logo}
            alt="App-Logo"
            className="w-28 sm:w-32 lg:w-40  "
          />
        </Link>
        <div>
          {userCtx.user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/buy")}
                className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-500"
              >
                <img className="w-5" src={assets.credit_star} alt="" />
                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  Credits left : {userCtx.credit}
                </p>
              </button>
              <p className="text-gray-700 max-sm:hidden pl-4">Hi, {userCtx.name}</p>
              <div className="relative group">
                <img
                  src={assets.profile_icon}
                  className="w-10 drop-shadow"
                  alt=""
                />
                <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                  <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
                    <li onClick={async()=>{ userCtx.logout()
                    

                    }} className="py-1 px-2 cursor-pointer pr-10">Logout</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-5">
              <p onClick={() => navigate("/buy")} className="cursor-pointer">
                Pricing
              </p>

              <button onClick={()=>{userCtx.setShowLogin(true)}} className="bg-zinc-700 text-white py-2 sm:px-10 text-sm rounded-full ">
                Log in
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
