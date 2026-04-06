import { useEffect } from "react";
import { motion } from "framer-motion";

export function InitialLoader({ onComplete }: { onComplete: () => void }) {
    useEffect(() => {
        // Bypass pentru testele Playwright (sare peste ecranul de încărcare)
        if (sessionStorage.getItem("skipLoader") === "true") {
            onComplete();
            return; // Oprește execuția aici, nu mai declanșează timeout-ul
        }

        // Va rula exact 1s (1000 milisecunde) pe site-ul real
        const timer = setTimeout(() => {
            onComplete();
        }, 1000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        // Overlay pe tot ecranul, fixat, cu z-index uriaș și glassmorphism
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }} // Iese cu un fade + blur foarte cool
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-1"
            >
                {/* Animație de pulsație și plutire direct pe Logo (fără fundal) */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="flex items-center justify-center"
                >
                    <img
                        src="/logo.png"
                        alt="SubSync logo"
                        className="h-28 w-28 object-contain drop-shadow-[0_0_25px_rgba(0,255,128,0.3)]"
                    />
                </motion.div>

                {/* Textul SubSync */}
                <div className="text-center">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
                        SubSync
                    </h1>
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="mt-2 text-sm font-medium text-muted-foreground"
                    >
                        Syncing your data...
                    </motion.p>
                </div>
            </motion.div>
        </motion.div>
    );
}