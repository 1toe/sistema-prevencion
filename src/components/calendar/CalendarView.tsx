
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Appointment, AppointmentStatus } from '@/types';

// Mock data for the calendar
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: 'patient1',
    professionalId: 'professional1',
    serviceId: 'service1',
    date: new Date(2025, 3, 16, 10, 0), // April 16, 2025 at 10:00
    startTime: '10:00',
    endTime: '10:30',
    status: AppointmentStatus.CONFIRMED,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    patientId: 'patient2',
    professionalId: 'professional1',
    serviceId: 'service2',
    date: new Date(2025, 3, 16, 11, 30), // April 16, 2025 at 11:30
    startTime: '11:30',
    endTime: '12:00',
    status: AppointmentStatus.SCHEDULED,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    patientId: 'patient3',
    professionalId: 'professional2',
    serviceId: 'service1',
    date: new Date(2025, 3, 17, 9, 0), // April 17, 2025 at 9:00
    startTime: '09:00',
    endTime: '09:30',
    status: AppointmentStatus.CONFIRMED,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const timeSlots = Array.from({ length: 9 }, (_, i) => `${i + 9}:00`); // 9:00 to 17:00

interface CalendarViewProps {
  onAddAppointment: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onAddAppointment }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');

  // Get appointments for the selected date or week
  const filteredAppointments = mockAppointments.filter(appointment => {
    if (view === 'day') {
      return isSameDay(appointment.date, selectedDate);
    } else {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return appointment.date >= start && appointment.date <= end;
    }
  });

  // Generate days for the week view
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  });

  // Get appointments for a specific day and time
  const getAppointmentForTimeSlot = (date: Date, time: string) => {
    return mockAppointments.find(
      appointment => 
        isSameDay(appointment.date, date) && 
        appointment.startTime === time
    );
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return format(date, 'EEEE d MMMM', { locale: es });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Seleccionar Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              locale={es}
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(appointment => (
                  <div 
                    key={appointment.id} 
                    className="p-3 rounded-md border border-border hover:border-health-accent transition-colors cursor-pointer"
                  >
                    <div className="font-medium">
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Paciente ID: {appointment.patientId}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Servicio ID: {appointment.serviceId}
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === AppointmentStatus.CONFIRMED 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No hay citas para la fecha seleccionada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {view === 'day' 
              ? `Agenda: ${formatDate(selectedDate)}` 
              : `Agenda: Semana del ${format(weekDays[0], 'd MMM', { locale: es })} al ${format(weekDays[6], 'd MMM', { locale: es })}`
            }
          </h2>
          <div className="flex items-center space-x-2">
            <Tabs 
              value={view} 
              onValueChange={(v) => setView(v as 'day' | 'week')}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="day">Día</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              onClick={onAddAppointment} 
              className="health-button-primary"
            >
              Nueva Cita
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {view === 'day' ? (
            <div className="divide-y">
              {timeSlots.map(time => {
                const appointment = getAppointmentForTimeSlot(selectedDate, time);
                
                return (
                  <div 
                    key={time}
                    className={`flex p-2 min-h-16 ${
                      appointment ? 'bg-health-light hover:bg-health-light/80' : 'hover:bg-muted/50'
                    } transition-colors cursor-pointer`}
                    onClick={appointment ? () => {} : onAddAppointment}
                  >
                    <div className="w-20 font-medium text-sm py-1">{time}</div>
                    <div className="flex-1">
                      {appointment ? (
                        <div className="p-2 rounded bg-health-primary text-white h-full">
                          <div className="font-medium">Paciente: {appointment.patientId}</div>
                          <div className="text-sm">Servicio: {appointment.serviceId}</div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                          <span>Disponible</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-8 divide-x divide-y border-b">
              <div className="p-2 font-medium bg-muted text-muted-foreground">Hora</div>
              {weekDays.map(day => (
                <div key={day.toString()} className="p-2 font-medium bg-muted text-muted-foreground">
                  <div>{format(day, 'E', { locale: es })}</div>
                  <div>{format(day, 'd', { locale: es })}</div>
                </div>
              ))}

              {timeSlots.map(time => (
                <React.Fragment key={time}>
                  <div className="p-2 font-medium text-sm">{time}</div>
                  {weekDays.map(day => {
                    const appointment = getAppointmentForTimeSlot(day, time);
                    
                    return (
                      <div 
                        key={day.toString()}
                        className={`p-2 min-h-12 ${
                          appointment ? 'bg-health-light' : 'hover:bg-muted/50'
                        } transition-colors cursor-pointer`}
                        onClick={appointment ? () => {} : onAddAppointment}
                      >
                        {appointment ? (
                          <div className="p-1 rounded bg-health-primary text-white text-xs">
                            <div className="font-medium truncate">ID: {appointment.patientId}</div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// We need to define the Button component here
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  className?: string,
  children: React.ReactNode 
}> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <button 
      className={className || "health-button-primary"}
      {...props}
    >
      {children}
    </button>
  );
};

export default CalendarView;
