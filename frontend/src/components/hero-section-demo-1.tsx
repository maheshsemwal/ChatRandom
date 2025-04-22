"use client";

import { motion } from "framer-motion";
import { GridBackground } from "./ui/GridBackground";
import { ModeToggle } from "./ui/mode-toggle";
import { useNavigate } from "react-router-dom";

export default function HeroSectionOne() {
  const navigate = useNavigate();

  return (
    <>
      <GridBackground />
      <div className="relative min-h-screen pt-28 px-4 sm:px-8">
        <Navbar />
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="py-10 md:py-20 px-2 sm:px-4">
          <h1 className="relative z-10 mx-auto max-w-4xl text-center font-bold text-slate-700 dark:text-slate-300 text-2xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight">
            {"Meet Someone New, Anytime, Anywhere!"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="relative z-10 mx-auto max-w-xl py-6 text-center text-base sm:text-lg md:text-xl font-normal text-neutral-600 dark:text-neutral-400"
          >
            Instantly connect with random people. Make new friends, chat, and stay connected!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              onClick={() => {
                navigate("/chat");
              }}
            >
              Start Chatting Now!
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto flex items-center justify-between rounded-xl border border-white/10 bg-white/30 px-4 py-3 backdrop-blur-md dark:border-neutral-800 dark:bg-black/20 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold text-foreground md:text-xl">ChatRandom</h1>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <button
          className="w-20 sm:w-28 transform rounded-lg bg-black px-4 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          onClick={() => navigate("/chat")}
        >
          Hop In
        </button>
      </div>
    </nav>
  );
};
