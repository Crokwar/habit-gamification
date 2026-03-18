import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { X, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { AuthContext } from "../../context/AuthContext";

const NAV_LINK_CLASSES =
  "text-[#ff5730] font-medium cursor-pointer transition-transform duration-200 hover:scale-105";

function Navbar() {

    // estado menu para mobile
    const [ isMenuOpen, setIsMenuOpen ] = useState(false)

    const { logout } = useContext(AuthContext)!;
    const navigate = useNavigate()
   
    const handleLogout = async () => {
        await logout();
        navigate("/login");
        alert("Sesión cerrada correctamente");
    };

    return (
      <nav className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                {/** Logo*/}
                <div className="flex items-center space-x-3">
                    <img
                        src="/LogoCoco.png"
                        alt="Logo Habit Gamification"
                        className="h-10 w-10 object-contain"
                    />
                    <h1 className="text-2xl font-bold text-[#ff5730]">
                        CocoHabit
                    </h1>
                </div>

                {/** Opciones */}
                <div className="hidden lg:flex items-center space-x-8">
                    <Link to="/habits" className={NAV_LINK_CLASSES}>
                        Hábitos
                    </Link>
                    <Link to="/habits" className={NAV_LINK_CLASSES}>
                        Nivel
                    </Link>
                    <Link to="/habits" className={NAV_LINK_CLASSES}>
                        Logros
                    </Link>
                    <Link to="/habits" className={NAV_LINK_CLASSES}>
                        Ranking
                    </Link>
                    <Link to="/habits" className={NAV_LINK_CLASSES}>
                        Perfil
                    </Link>
                    <button onClick={handleLogout} className={NAV_LINK_CLASSES}>
                        Log Out
                    </button>
                </div>

                {/** Opciones burger*/}
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} className="lg:hidden">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuItem>
                            <Link to="/habits" className="text-[#ff5730]">Hábitos</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to="/habits" className="text-[#ff5730]">Nivel</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to="/habits" className="text-[#ff5730]">Logros</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to="/habits" className="text-[#ff5730]">Ranking</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to="/habits" className="text-[#ff5730]">Perfil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-[#ff5730]">
                            Log Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </nav>
    )
}

export { Navbar }

