"use client";
import dynamic from "next/dynamic";
import animationData from "../../../public/web.json";
import { FiDownload } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";
import { motion } from "framer-motion";

const LottiePlayer = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100/5 rounded-lg animate-pulse"></div>
  ),
});

export default function FirstContent() {
  const item = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <>
      <motion.div
        className="container flex flex-col md:flex-row items-center justify-between w-full min-h-[600px] md:min-h-[500px]"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.14,
              delayChildren: 0.08,
            },
          },
        }}
      >
        <div className="space-y-6 mt-32 md:mt-0 md:space-y-8 order-1 max-w-full md:max-w-[60%]">
          <motion.h1
            className="text-3xl font-extrabold sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-rethink"
            variants={item}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            bukan cuma user, <br className="hidden sm:block" />
            tapi <span className="gradient-text">code</span> changer
          </motion.h1>

          <motion.div
            className="flex flex-wrap gap-3 sm:gap-4"
            variants={item}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="mailto:peterhiku12@gmail.com"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Email Peter Shaan"
              className="font-bebas-neue cursor-custom bg-[#393939]/28 backdrop-blur-2xl px-3 sm:px-4 py-1 text-base sm:text-lg border-2 border-white/20 rounded-lg tracking-widest flex items-center hover:bg-[#393939]/40 hover:border-white/30 transition-all duration-300"
            >
              EMAIL ME
              <PiShareFat className="ml-2" size={18} />
            </a>
            <a
              href="/cv-petershaan.pdf"
              download
              aria-label="Download Peter Shaan's CV"
              rel="noopener noreferrer"
              className="font-bebas-neue cursor-custom bg-[#393939]/28 backdrop-blur-2xl px-3 sm:px-4 py-1 text-base sm:text-lg border-2 border-white/20 rounded-lg tracking-widest flex items-center hover:bg-[#393939]/40 hover:border-white/30 transition-all duration-300"
            >
              MY CV
              <FiDownload className="ml-2" size={18} />
            </a>
          </motion.div>

          <motion.div
            className="flex gap-4 font-bebas-neue text-xl sm:text-2xl"
            variants={item}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="https://linkedin.com/in/petershaan12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Peter Shaan's LinkedIn profile"
            >
              💼 <span className="hover:underline">LD</span>
            </a>
            <a
              href="https://youtube.com/@petershaan_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Peter Shaan's YouTube channel"
            >
              🎬 <span className="hover:underline">YT</span>
            </a>
            <a
              href="https://pinterest.com/petershaan_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Peter Shaan's Pinterest profile"
            >
              🎨 <span className="hover:underline">PT</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center order-1 lg:order-2 mb-4 lg:mb-0 w-full md:w-[40%] max-w-[500px]"
          variants={item}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <LottiePlayer
            animationData={animationData}
            loop={true}
            autoplay={true}
            className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px]"
            style={{ width: "100%", height: "auto", maxWidth: "500px" }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
