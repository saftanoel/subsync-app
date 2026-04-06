import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(true); // By default, pornim pe Dark

    useEffect(() => {
        const root = document.documentElement;
        // Verificăm dacă user-ul a ales deja o temă în trecut
        const storedTheme = localStorage.getItem("theme");

        if (storedTheme === "light") {
            // Dacă a ales explicit light mode înainte, i-l dăm
            root.classList.remove("dark");
            setIsDark(false);
        } else {
            // Dacă e prima dată când intră pe site (sau a ales dark), forțăm dark
            root.classList.add("dark");
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        // Trimitem semnalul pentru loader
        window.dispatchEvent(new Event("triggerLoader"));

        setTimeout(() => {
            const root = document.documentElement;
            root.classList.toggle("dark");

            const isNowDark = root.classList.contains("dark");
            // Salvăm noua preferință în browser
            localStorage.setItem("theme", isNowDark ? "dark" : "light");
            setIsDark(isNowDark);
        }, 100);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full transition-transform hover:scale-110"
            title="Toggle Theme"
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
                <Moon className="h-5 w-5 text-slate-700" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}