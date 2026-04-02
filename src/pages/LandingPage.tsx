import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, TrendingDown, PieChart, Shield } from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: TrendingDown, title: "Track Spending", desc: "See exactly where your money goes each month." },
    { icon: PieChart, title: "Visual Insights", desc: "Beautiful charts that update in real-time." },
    { icon: Shield, title: "Smart Savings", desc: "ROI projections show what you'd save by cutting." },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            <span className="text-destructive">Stop bleeding money.</span>
            <br />
            <span className="gradient-text">Start syncing.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Easily track and manage all your subscriptions in one place.
            See your total spend, get renewal reminders, and find subscriptions worth cutting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 flex gap-4"
        >
          {/* Buton Get Started - Hover Intens */}
          <motion.div whileHover={{ scale: 1.05, filter: "brightness(1.1)" }} whileTap={{ scale: 0.95 }}>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="gradient-primary text-primary-foreground font-semibold glow-primary gap-2 text-base px-8 shadow-xl transition-all">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Buton Learn More - Hover Intens */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-base px-8 transition-all">
                {isAuthenticated ? "Dashboard" : "Learn More"}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 w-full max-w-3xl"
        >
          <div className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Your subscriptions</span>
              <span className="text-sm text-muted-foreground">Total monthly spend</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Netflix", cost: "$15.99", cycle: "Monthly" },
                { name: "Spotify", cost: "$16.99", cycle: "Monthly" },
                { name: "iCloud+", cost: "$2.99", cycle: "Monthly" },
              ].map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3"
                >
                  <span className="text-sm font-medium">{s.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-primary font-semibold">{s.cost}</span>
                    <span className="text-xs text-muted-foreground">{s.cycle}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <span className="font-display text-2xl font-bold text-primary">$35.97</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features - Hover foarte mic (Lift-up) */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }} // Salt discret de 4px
              transition={{
                delay: i * 0.15,
                y: { duration: 0.2 } // Face saltul rapid și snappy
              }}
              className="glass rounded-2xl p-6 transition-all hover:border-primary/40 cursor-pointer"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}