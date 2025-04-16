
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import CalendarView from '@/components/calendar/CalendarView';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Clock, Calendar, Users, CheckCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddAppointment = () => {
    setIsFormOpen(true);
  };

  const handleSaveAppointment = (appointmentData: any) => {
    console.log('Appointment data:', appointmentData);
    toast.success('Cita agendada correctamente');
    setIsFormOpen(false);
  };

  const statCards = [
    { 
      title: 'Citas Hoy', 
      value: '8', 
      icon: <Clock className="h-8 w-8 text-health-primary" />,
      description: '3 pendientes'
    },
    { 
      title: 'Citas Esta Semana', 
      value: '32', 
      icon: <Calendar className="h-8 w-8 text-health-secondary" />,
      description: '↑ 12% vs semana pasada'
    },
    { 
      title: 'Pacientes Activos', 
      value: '156', 
      icon: <Users className="h-8 w-8 text-health-accent" />,
      description: '12 nuevos este mes'
    },
    { 
      title: 'Tasa de Asistencia', 
      value: '92%', 
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      description: '↑ 4% vs mes pasado'
    },
  ];

  return (
    <PageLayout title={`Bienvenido/a, ${user?.name}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <CalendarView onAddAppointment={handleAddAppointment} />
      
      <AppointmentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveAppointment} 
      />
    </PageLayout>
  );
};

export default DashboardPage;
