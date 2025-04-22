"use client"

import { motion } from "framer-motion"
import { Users, Shield, Video, Brain } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Random Instant Matches",
    description: "Meet someone new anytime with our instant matching system.",
    iconBg: "bg-violet-500/10 text-violet-500",
    delay: 0.1,
    comingSoon: false
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Privacy Focused",
    description: "No personal details required. Chat with complete anonymity.",
    iconBg: "bg-pink-500/10 text-pink-500",
    delay: 0.2,
    comingSoon: false
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Multiple Chat Modes",
    description: "Text, Voice & Video options coming soon for diverse communication.",
    iconBg: "bg-blue-500/10 text-blue-500",
    delay: 0.3,
    comingSoon: true
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Smart Matching Algorithm",
    description: "Connect with like-minded people based on interests and preferences.",
    iconBg: "bg-emerald-500/10 text-emerald-500",
    delay: 0.4,
    comingSoon: true
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-3">
            <div className="flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-border bg-muted text-muted-foreground text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Features</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                duration: 0.6,
                delay: feature.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <Card className="relative group overflow-hidden transition-all duration-300 border border-border bg-card text-card-foreground hover:border-primary hover:bg-accent hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-6 relative transition-colors duration-300">
                  {feature.comingSoon && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-bl-md dark:bg-yellow-500 dark:text-black z-10">
                      Coming Soon
                    </div>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition duration-300 group-hover:shadow-md group-hover:scale-105 ${feature.iconBg}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
