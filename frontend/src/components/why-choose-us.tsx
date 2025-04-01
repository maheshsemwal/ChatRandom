"use client"

import { motion } from "framer-motion"
import { Users, Shield, Video, Brain } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: <Users className="w-10 h-10" />,
    title: "Random Instant Matches",
    description: "Meet someone new anytime with our instant matching system.",
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500/20",
    delay: 0.1,
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Privacy Focused",
    description: "No personal details required. Chat with complete anonymity.",
    gradient: "from-pink-500 to-rose-600",
    iconBg: "bg-pink-500/20",
    delay: 0.2,
  },
  {
    icon: <Video className="w-10 h-10" />,
    title: "Multiple Chat Modes",
    description: "Text, Voice & Video options coming soon for diverse communication.",
    gradient: "from-blue-500 to-cyan-600",
    iconBg: "bg-blue-500/20",
    delay: 0.3,
  },
  {
    icon: <Brain className="w-10 h-10" />,
    title: "Smart Matching Algorithm",
    description: "Connect with like-minded people based on interests and preferences.",
    gradient: "from-emerald-500 to-green-600",
    iconBg: "bg-emerald-500/20",
    delay: 0.4,
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-black/90"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
      <div className="absolute -top-[500px] -left-[500px] w-[1000px] h-[1000px] rounded-full bg-purple-500/10 blur-3xl"></div>
      <div className="absolute -bottom-[500px] -right-[500px] w-[1000px] h-[1000px] rounded-full bg-pink-500/10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-3">
            <div className="flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-white/80">Features</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Why Choose Us?
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Discover what makes our chat platform unique and why users love it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: feature.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              className="group"
            >
              <Card className="border-0 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl overflow-hidden h-full">
                <div className="p-8 relative">
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-[1px] bg-black/90 rounded-2xl z-10"></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl z-0`}></div>
                  </div>

                  <div className="relative z-20">
                    {/* Icon with gradient background */}
                    <div
                      className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className={`text-gradient bg-gradient-to-br ${feature.gradient}`}>{feature.icon}</div>
                    </div>

                    {/* Title with gradient on hover */}
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/60 text-lg leading-relaxed">{feature.description}</p>

                    {/* Animated underline */}
                    <div className="mt-6 h-[2px] w-12 bg-gradient-to-r from-white/40 to-transparent rounded-full group-hover:w-24 transition-all duration-300"></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

