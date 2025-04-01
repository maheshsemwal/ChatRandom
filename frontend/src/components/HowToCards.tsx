import { motion } from 'framer-motion'
import { MessageSquare, Users, Zap } from 'lucide-react'
import { Button } from './ui/button'

const HowToCards = () => {
  const steps = [
    {
      icon: <MessageSquare className="w-10 h-10 text-primary" />, // Uses theme-based colors
      title: 'Click "Start Chatting Now"',
      description: "Begin your journey with a simple click to enter our chat platform.",
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Get Instantly Matched",
      description: "Our algorithm connects you with someone new in seconds.",
    },
    {
      icon: <Zap className="w-10 h-10 " />,
      title: "Chat & Connect",
      description: "Make friends and stay connected with people from around the world.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  return (
    <section className="py-20 bg-background flex justify-center" id="how-it-works">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold text-foreground">How It Works</h2>
        <p className="text-neutral-600  max-w-3xl mx-auto mt-2">
          Start chatting in three simple steps and connect with new friends instantly.
        </p>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 py-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="relative w-80 h-96 backdrop-blur-lg bg-white/5 border border-gray-800 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 group flex flex-col justify-center items-center cursor-pointer"
            >
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold ">
                {index + 1}
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center  group-hover:bg-gray-700 transition-colors duration-300 dark:bg-background">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold my-4">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-10">
          <Button size="lg">Hop In & Start Chatting!</Button>
        </div>
      </div>
    </section>
  );
};

export default HowToCards
