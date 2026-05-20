import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, TrendingDown, PieChart, Shield } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: TrendingDown, title: "Track Spending", desc: "See exactly where your money goes each month." },
    { icon: PieChart, title: "Visual Insights", desc: "Beautiful charts that update in real-time." },
    { icon: Shield, title: "Smart Savings", desc: "ROI projections show what you'd save by cutting." },
  ];

  return (
    // Adăugăm 'relative' și 'overflow-hidden' pentru a ține canvas-ul limitat la această zonă
    <div className={cn('relative', 'min-h-[calc(100vh-4rem)]', 'overflow-hidden')}>

      {/* Magia Antigravity în fundal */}
      <ParticleBackground />
 
      {/* Tot conținutul de mai jos primește z-10 ca să stea deasupra particulelor și să poată primi click-uri */}
      <div className={cn('relative', 'z-10')}>
        {/* Hero */}
        <section className={cn('container', 'mx-auto', 'flex', 'flex-col', 'items-center', 'justify-center', 'px-4', 'py-24', 'text-center', 'lg:py-32')}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className={cn('font-display', 'text-5xl', 'font-bold', 'leading-tight', 'tracking-tight', 'md:text-7xl')}>
              <span className="text-destructive">Stop bleeding money.</span>
              <br />
              <span className="gradient-text">Start syncing.</span>
            </h1>
            <p className={cn('mx-auto', 'mt-6', 'max-w-2xl', 'text-lg', 'text-muted-foreground')}>
              Easily track and manage all your subscriptions in one place.
              See your total spend, get renewal reminders, and find subscriptions worth cutting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={cn('mt-10', 'flex', 'gap-4')}
          >
            {/* Buton Get Started - Hover Intens */}
            <motion.div whileHover={{ scale: 1.05, filter: "brightness(1.1)" }} whileTap={{ scale: 0.95 }}>
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" className={cn('gradient-primary', 'text-primary-foreground', 'font-semibold', 'glow-primary', 'gap-2', 'text-base', 'px-8', 'shadow-xl', 'transition-all')}>
                  Get Started <ArrowRight className={cn('h-4', 'w-4')} />
                </Button>
              </Link>
            </motion.div>

            {/* Buton Learn More - Hover Intens */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button size="lg" variant="outline" className={cn('border-border', 'text-foreground', 'hover:bg-secondary', 'text-base', 'px-8', 'transition-all')}>
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
            className={cn('mt-16', 'w-full', 'max-w-3xl')}
          >
            <div className={cn('glass', 'rounded-2xl', 'p-6')}>
              <div className={cn('mb-4', 'flex', 'items-center', 'justify-between')}>
                <span className={cn('text-sm', 'font-medium', 'text-muted-foreground')}>Your subscriptions</span>
                <span className={cn('text-sm', 'text-muted-foreground')}>Total monthly spend</span>
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
                    className={cn('flex', 'items-center', 'justify-between', 'rounded-xl', 'bg-secondary/50', 'px-4', 'py-3')}
                  >
                    <span className={cn('text-sm', 'font-medium')}>{s.name}</span>
                    <div className={cn('flex', 'items-center', 'gap-4')}>
                      <span className={cn('text-sm', 'text-primary', 'font-semibold')}>{s.cost}</span>
                      <span className={cn('text-xs', 'text-muted-foreground')}>{s.cycle}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className={cn('mt-4', 'text-right')}>
                <span className={cn('font-display', 'text-2xl', 'font-bold', 'text-primary')}>$35.97</span>
                <span className={cn('text-sm', 'text-muted-foreground')}>/mo</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features - Hover foarte mic (Lift-up) */}
        <section className={cn('container', 'mx-auto', 'px-4', 'pb-24')}>
          <div className={cn('grid', 'gap-6', 'md:grid-cols-3')}>
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
                className={cn('glass', 'rounded-2xl', 'p-6', 'transition-all', 'hover:border-primary/40', 'cursor-pointer')}
              >
                <div className={cn('mb-4', 'flex', 'h-10', 'w-10', 'items-center', 'justify-center', 'rounded-xl', 'gradient-primary')}>
                  <f.icon className={cn('h-5', 'w-5', 'text-primary-foreground')} />
                </div>
                <h3 className={cn('font-display', 'text-lg', 'font-semibold')}>{f.title}</h3>
                <p className={cn('mt-2', 'text-sm', 'text-muted-foreground')}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className={cn('mt-12', 'border-t', 'border-border/40', 'glass')}>
          <div className={cn('container', 'mx-auto', 'px-4', 'py-8')}>
            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-8')}>
              <div>
                <h3 className={cn('font-display', 'text-xl', 'font-bold', 'gradient-text')}>SubSync</h3>
                <p className={cn('mt-2', 'text-sm', 'text-muted-foreground')}>
                  The ultimate subscription manager. Take back control of your recurring expenses and stop bleeding money.
                </p>
              </div>
              <div className={cn('space-y-2', 'md:justify-self-center', 'text-center', 'md:text-left')}>
                <h4 className={cn('font-semibold', 'text-foreground')}>Navigation</h4>
                <div className={cn('flex', 'flex-col', 'space-y-1', 'text-sm', 'text-muted-foreground', 'items-center', 'md:items-start')}>
                  <Link to="/" className={cn('hover:text-primary', 'transition-colors')}>Home</Link>
                  <Link to="/dashboard" className={cn('hover:text-primary', 'transition-colors')}>Dashboard</Link>
                  <Link to="/login" className={cn('hover:text-primary', 'transition-colors')}>Log In</Link>
                </div>
              </div>
              <div className={cn('space-y-2', 'md:justify-self-end', 'text-center', 'md:text-right')}>
                <h4 className={cn('font-semibold', 'text-foreground')}>Legal</h4>
                <div className={cn('flex', 'flex-col', 'space-y-1', 'text-sm', 'text-muted-foreground', 'items-center', 'md:items-end')}>
                  <span className={cn('hover:text-primary', 'transition-colors', 'cursor-pointer')}>Privacy Policy</span>
                  <span className={cn('hover:text-primary', 'transition-colors', 'cursor-pointer')}>Terms of Service</span>
                </div>
              </div>
            </div>
            <div className={cn('mt-8', 'border-t', 'border-border/40', 'pt-6', 'text-center', 'text-sm', 'text-muted-foreground')}>
              &copy; {new Date().getFullYear()} SubSync. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}