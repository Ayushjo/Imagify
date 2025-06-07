import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { use } from "react";
import { AppContext } from "../context/App-context";

export const Result = () => {
  const userCtx = use(AppContext);
  const inputRef = useRef();
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState(null);

  const onSubmitHnadler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (prompt) {
      const response =await userCtx.generateImages(prompt);
      if (response) {
        setIsImageLoaded(true);
        setImage(response);
      }
    }

    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={onSubmitHnadler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div>
        <div className="relative ">
          <img src={image?image:assets.sample_img_1} alt="" className="max-w-sm rounded" />
          <span
            className={`${
              loading
                ? "absolute bottom-0 left-0 h-1 bg-blue-500  transition-all duration-[10s] w-full"
                : "absolute bottom-0 left-0 h-1 bg-blue-500 "
            }`}
          />
        </div>
        <p className={!loading ? "hidden" : ""}>Loading....</p>
      </div>
      {isImageLoaded ? (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            onClick={() => setIsImageLoaded(false)}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
          >
            Generate Another
          </p>
          <a
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
            href={image}
          >
            Download
          </a>
        </div>
      ) : (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
          />
          <button
            type="submit"
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full text-white"
          >
            Generate
          </button>
        </div>
      )}
    </motion.form>
  );
};
