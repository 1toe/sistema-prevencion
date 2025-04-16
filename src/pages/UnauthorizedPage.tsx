
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-health-primary mb-2">Acceso Restringido</h1>
        <p className="text-muted-foreground mb-6">
          No tiene permisos para acceder a esta página.
        </p>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => navigate('/dashboard')} className="health-button-primary">
            Volver al Inicio
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="health-button-outline">
            Volver Atrás
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
