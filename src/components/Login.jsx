import React, { use, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/App-context";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

export const Login = () => {
  const userCtx = use(AppContext);
  const [state, setState] = useState("Login");
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleForm = async (e) => {
    e.preventDefault();
    if (state === "Login") {
      const res = await userCtx.login(email, password);
    } else if (state === "Sign Up") {
      const res =await userCtx.register(name, email, password);
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={handleForm}
        className="relative bg-white rounded-xl p-10 text-slate-500"
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state !== "Login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <img width={24} src={assets.profile_icon} alt="" />
            <input
              className="outline-none text-sm"
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img width={18} src={assets.email_icon} alt="" />
          <input
            className="outline-none text-sm"
            type="email"
            placeholder="Email ID"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img width={15} src={assets.lock_icon} alt="" />
          <input
            className="outline-none text-sm"
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot password?
        </p>
        <button className="bg-blue-600 w-full text-white py-2 rounded-full ">
          {state === "Login" ? "Login" : "Create Account"}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-600 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
              }}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => {
            userCtx.setShowLogin(false);
          }}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt=""
        />
      </motion.form>
    </div>
  );
};
