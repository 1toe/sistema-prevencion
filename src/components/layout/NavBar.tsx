
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Users, FileText, PackageOpen, 
  Settings, LogOut, Menu, X
} from 'lucide-react';
import { UserRole } from '@/types';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { name: 'Agenda', path: '/dashboard', icon: Calendar, roles: [UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.STAFF] },
    { name: 'Profesionales', path: '/professionals', icon: Users, roles: [UserRole.ADMIN] },
    { name: 'Ficha Clínica', path: '/medical-records', icon: FileText, roles: [UserRole.ADMIN, UserRole.PROFESSIONAL] },
    { name: 'Inventario', path: '/inventory', icon: PackageOpen, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { name: 'Configuración', path: '/settings', icon: Settings, roles: [UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="text-xl font-bold">Prevención Viña</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredNavItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className="flex items-center space-x-1 hover:text-accent transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary text-primary-foreground">
              <div className="flex flex-col space-y-6 mt-8">
                {filteredNavItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className="flex items-center space-x-2 hover:text-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ))}
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex items-center justify-start space-x-2 hover:text-accent transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-lg">Cerrar Sesión</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
