import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface NavigationProps {
  onAuthModal: (mode: "login" | "register") => void;
}

export function Navigation({ onAuthModal }: NavigationProps) {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-bg/90 backdrop-blur-md border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">
                <span className="text-neon-red animate-glow">Seven</span> Bots
              </h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="text-gray-300 hover:text-neon-red transition-colors duration-300">
                Início
              </a>
              <a href="#plans" className="text-gray-300 hover:text-neon-red transition-colors duration-300">
                Planos
              </a>
              <a href="#features" className="text-gray-300 hover:text-neon-red transition-colors duration-300">
                Recursos
              </a>
              <a href="#contact" className="text-gray-300 hover:text-neon-red transition-colors duration-300">
                Contato
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <span className="text-gray-300 text-sm">Olá, {user.name}</span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white"
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onAuthModal("login")}
                  className="text-gray-300 hover:text-white"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => onAuthModal("register")}
                  className="bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon transition-all duration-300 transform hover:scale-105"
                >
                  Registrar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
