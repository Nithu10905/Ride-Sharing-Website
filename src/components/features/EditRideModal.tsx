
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Car, CreditCard, Users, Clock, Save, X } from "lucide-react";
import { Ride } from "@/types";
import { useRides } from "@/contexts/RideContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EditRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
}

export default function EditRideModal({ isOpen, onClose, ride }: EditRideModalProps) {
  const { updateRideDetails } = useRides();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [availableSeats, setAvailableSeats] = useState(ride.availableSeats);
  const [price, setPrice] = useState(ride.price);
  const [departureDate, setDepartureDate] = useState<Date>(new Date(ride.departureTime));
  const [departureTime, setDepartureTime] = useState(format(new Date(ride.departureTime), "HH:mm"));
  const [arrivalTime, setArrivalTime] = useState(format(new Date(ride.arrivalTime), "HH:mm"));
  const [paymentType, setPaymentType] = useState<'cash' | 'upi' | 'card' | 'online'>(ride.paymentType || 'cash');
  const [fromName, setFromName] = useState(ride.from.name);
  const [fromAddress, setFromAddress] = useState(ride.from.address);
  const [toName, setToName] = useState(ride.to.name);
  const [toAddress, setToAddress] = useState(ride.to.address);
  const [vehicleMake, setVehicleMake] = useState(ride.vehicle?.make || '');
  const [vehicleModel, setVehicleModel] = useState(ride.vehicle?.model || '');
  const [vehicleColor, setVehicleColor] = useState(ride.vehicle?.color || '');

  const handleSave = async () => {
    setLoading(true);
    try {
      // Create departure and arrival datetime strings
      const departureDateTimeString = `${format(departureDate, 'yyyy-MM-dd')}T${departureTime}:00`;
      const arrivalDateTimeString = `${format(departureDate, 'yyyy-MM-dd')}T${arrivalTime}:00`;
      
      const updatedRideData = {
        availableSeats,
        price,
        departureTime: departureDateTimeString,
        arrivalTime: arrivalDateTimeString,
        paymentType,
        from: {
          name: fromName,
          address: fromAddress
        },
        to: {
          name: toName,
          address: toAddress
        },
        vehicle: {
          make: vehicleMake,
          model: vehicleModel,
          color: vehicleColor
        }
      };

      const success = await updateRideDetails(ride.id, updatedRideData);
      
      if (success) {
        toast({
          title: "Ride Updated",
          description: "Your ride details have been updated successfully.",
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating ride:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update ride details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-blue-600" />
            <span>Edit Ride Details</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-1">
          {/* Basic Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seats" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Available Seats</span>
              </Label>
              <Select value={availableSeats.toString()} onValueChange={(value) => setAvailableSeats(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 seat</SelectItem>
                  <SelectItem value="2">2 seats</SelectItem>
                  <SelectItem value="3">3 seats</SelectItem>
                  <SelectItem value="4">4 seats</SelectItem>
                  <SelectItem value="5">5 seats</SelectItem>
                  <SelectItem value="6">6 seats</SelectItem>
                  <SelectItem value="7">7 seats</SelectItem>
                  <SelectItem value="8">8 seats</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Price per Seat (₹)</span>
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="1"
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Departure Date & Time</span>
            </Label>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={(date) => date && setDepartureDate(date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="departure-time">Departure Time</Label>
                <Input
                  id="departure-time"
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="arrival-time">Arrival Time</Label>
                <Input
                  id="arrival-time"
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payment Method</span>
            </Label>
            <Select value={paymentType} onValueChange={(value: 'cash' | 'upi' | 'card' | 'online') => setPaymentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash Payment</SelectItem>
                <SelectItem value="upi">UPI Payment</SelectItem>
                <SelectItem value="card">Card Payment</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pickup and Drop-off Locations */}
          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Pickup & Drop-off Locations</span>
            </Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-name">From (City)</Label>
                <Input
                  id="from-name"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="e.g., Mumbai"
                />
              </div>
              
              <div>
                <Label htmlFor="to-name">To (City)</Label>
                <Input
                  id="to-name"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="e.g., Pune"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-address">Pickup Address</Label>
                <Textarea
                  id="from-address"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  placeholder="Enter pickup address"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="to-address">Drop-off Address</Label>
                <Textarea
                  id="to-address"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="Enter drop-off address"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Vehicle Details</span>
            </Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle-make">Make</Label>
                <Input
                  id="vehicle-make"
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                  placeholder="e.g., Maruti Suzuki"
                />
              </div>
              
              <div>
                <Label htmlFor="vehicle-model">Model</Label>
                <Input
                  id="vehicle-model"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g., Swift"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="vehicle-color">Color</Label>
              <Input
                id="vehicle-color"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                placeholder="e.g., White"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
