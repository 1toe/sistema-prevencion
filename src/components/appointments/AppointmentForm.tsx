
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from "@/components/ui/sonner";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Datos de prueba
const mockProfessionals = [
  { id: 'professional1', name: 'Dr. Gonzalez', specialty: 'Medicina General' },
  { id: 'professional2', name: 'Dra. Rodriguez', specialty: 'Psicología' },
];

const mockServices = [
  { id: 'service1', name: 'Consulta General', duration: 30 },
  { id: 'service2', name: 'Test de VIH', duration: 20 },
  { id: 'service3', name: 'Evaluación Psicológica', duration: 45 },
];

const mockPatients = [
  { id: 'patient1', name: 'Juan Pérez' },
  { id: 'patient2', name: 'María García' },
  { id: 'patient3', name: 'Carlos López' },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !professionalId || !patientId || !serviceId) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const appointmentData = {
      date,
      time,
      professionalId,
      patientId,
      serviceId,
      notes,
    };

    onSave(appointmentData);
    toast.success('Cita agendada correctamente');
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setDate(new Date());
    setTime('');
    setProfessionalId('');
    setPatientId('');
    setServiceId('');
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Cita</DialogTitle>
          <DialogDescription>
            Complete el formulario para agendar una nueva cita
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Date picker */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Fecha
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                      locale={es}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Time picker */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Hora
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar horario" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Professional selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="professional" className="text-right">
                Profesional
              </Label>
              <Select value={professionalId} onValueChange={setProfessionalId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar profesional" />
                </SelectTrigger>
                <SelectContent>
                  {mockProfessionals.map((pro) => (
                    <SelectItem key={pro.id} value={pro.id}>
                      {pro.name} - {pro.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Patient selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">
                Paciente
              </Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Servicio
              </Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {mockServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notas
              </Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                placeholder="Notas adicionales (opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Agendar Cita</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
