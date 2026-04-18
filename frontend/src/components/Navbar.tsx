import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle"

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = isAuthenticated
    ? [
      { to: "/", label: "Home" },
      { to: "/dashboard", label: "Dashboard" },
    ]
    : [
      { to: "/", label: "Home" },
      { to: "/login", label: "Login" },
    ];

  // Logica inteligentă pentru apăsarea pe logo
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (location.pathname === "/") {
      // Hard refresh dacă suntem deja pe pagina principală (declanșează și Loading Screen-ul)
      window.location.reload();
    } else {
      // Navigare fină spre pagina principală dacă suntem oriunde altundeva
      navigate("/");
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass sticky top-0 z-50 border-b border-border"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo cu hover discret și logica de refresh */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" alt="SubSync Logo" className="h-12 w-12 object-contain relative top-[2px]" />
            <span className="font-display text-xl font-bold gradient-text">SubSync</span>
          </a>
        </motion.div>

        <div className="flex items-center gap-6">

          {/* Butonul de Dark / Light Mode */}
          <ThemeToggle />

          {/* Link-urile de navigare cu salt (lift-up) */}
          {navLinks.map(link => (
            <motion.div
              key={link.to}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          {/* Secțiunea de Autentificare */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              {/* Buton Logout cu hover */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          ) : (
            /* Buton Sign Up cu hover intens */
            <motion.div
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register">
                <Button size="sm" className="gradient-primary text-primary-foreground font-semibold glow-primary px-5 shadow-md">
                  Sign Up
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}