
import { useState } from "react";
import { Ride } from "@/types";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { X, Users, MapPin, Zap, Cigarette, PawPrint, CreditCard, Smartphone, IndianRupee, MessageSquare, Phone } from "lucide-react";
import { useRides } from "@/contexts/RideContext";
import { useToast } from "@/hooks/use-toast";

interface PublishedRideCardProps {
  ride: Ride;
}

export default function PublishedRideCard({ ride }: PublishedRideCardProps) {
  const { updateRideAmenities } = useRides();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState(ride.amenities || {});
  const [instantBooking, setInstantBooking] = useState(ride.instantBooking || false);

  const departureDate = parseISO(ride.departureTime);
  const arrivalDate = parseISO(ride.arrivalTime);
  const isCancelled = ride.status === 'cancelled';

  const handleContactPassenger = (passengerId: string) => {
    navigate(`/contact-driver/${ride.id}?passenger=${passengerId}`);
  };

  const handleQuickCall = (passenger: any) => {
    if (passenger.phone) {
      window.open(`tel:${passenger.phone}`);
      toast({
        title: "Opening Phone",
        description: `Calling ${passenger.name}`,
      });
    } else {
      toast({
        title: "Phone Not Available",
        description: "Passenger's phone number is not available.",
        variant: "destructive"
      });
    }
  };

  const getPaymentIcon = (paymentType?: string) => {
    switch (paymentType) {
      case 'upi':
        return <Smartphone className="h-4 w-4 mr-1" />;
      case 'card':
        return <CreditCard className="h-4 w-4 mr-1" />;
      case 'online':
        return <CreditCard className="h-4 w-4 mr-1" />;
      case 'cash':
      default:
        return <IndianRupee className="h-4 w-4 mr-1" />;
    }
  };

  const getPaymentLabel = (paymentType?: string) => {
    switch (paymentType) {
      case 'upi':
        return 'UPI';
      case 'card':
        return 'Card';
      case 'online':
        return 'Online';
      case 'cash':
      default:
        return 'Cash';
    }
  };

  const handleAmenityChange = async (amenityType: string, checked: boolean) => {
    const newAmenities = { ...amenities, [amenityType]: checked };
    setAmenities(newAmenities);
    
    // Update the ride with new amenities
    await updateRideAmenities(ride.id, newAmenities, amenityType === 'instantBooking' ? checked : instantBooking);
  };

  const handleInstantBookingChange = async (checked: boolean) => {
    setInstantBooking(checked);
    await updateRideAmenities(ride.id, amenities, checked);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-4 border ${isCancelled ? 'border-red-200' : 'border-gray-200'}`}>
      {isCancelled && (
        <div className="mb-2 bg-red-50 rounded-md p-2 flex items-center text-sm">
          <X className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-red-600">Cancelled</span>
          {ride.cancelReason && <span className="text-red-500 ml-1">- {ride.cancelReason}</span>}
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-lg font-semibold">
            {format(departureDate, "EEE, dd MMM")}
          </div>
          <div className="flex items-center mt-2">
            <div>
              <div className="font-medium">{format(departureDate, "HH:mm")}</div>
              <div className="text-sm text-gray-600">{ride.from.name}</div>
            </div>
            <div className="mx-4 w-16 border-t border-gray-300"></div>
            <div>
              <div className="font-medium">{format(arrivalDate, "HH:mm")}</div>
              <div className="text-sm text-gray-600">{ride.to.name}</div>
            </div>
          </div>

          {/* Stopovers */}
          {ride.stopovers && ride.stopovers.length > 0 && (
            <div className="mt-2 flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Stopovers:</span>
              <div className="flex flex-wrap gap-1">
                {ride.stopovers.map((stopover, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {stopover}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Payment Type Display */}
          <div className="mt-2 flex items-center text-sm text-gray-600">
            {getPaymentIcon(ride.paymentType)}
            <span>{getPaymentLabel(ride.paymentType)}</span>
          </div>
          
          {/* Passengers */}
          <div className="mt-3">
            <div className="flex items-center mb-2">
              <Users className="h-4 w-4 text-gray-500 mr-2" />
              {ride.passengers && ride.passengers.length > 0 ? (
                <span className="text-sm text-gray-600">{ride.passengers.length} passenger(s):</span>
              ) : (
                <span className="text-sm text-gray-600">No passengers yet</span>
              )}
            </div>
            
            {ride.passengers && ride.passengers.length > 0 && (
              <div className="space-y-2">
                {ride.passengers.map((passenger) => (
                  <div key={passenger.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{passenger.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium">{passenger.name}</span>
                        {passenger.phone && (
                          <p className="text-xs text-gray-500">{passenger.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContactPassenger(passenger.id)}
                        className="h-7 px-2"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuickCall(passenger)}
                        className="h-7 px-2"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amenity Checkboxes */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Amenities:</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`instant-${ride.id}`}
                  checked={instantBooking}
                  onCheckedChange={handleInstantBookingChange}
                />
                <label htmlFor={`instant-${ride.id}`} className="text-sm flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Instant Booking
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`smoking-${ride.id}`}
                  checked={amenities.smoking || false}
                  onCheckedChange={(checked) => handleAmenityChange('smoking', checked as boolean)}
                />
                <label htmlFor={`smoking-${ride.id}`} className="text-sm flex items-center">
                  <Cigarette className="h-3 w-3 mr-1" />
                  Smoking allowed
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`pets-${ride.id}`}
                  checked={amenities.pets || false}
                  onCheckedChange={(checked) => handleAmenityChange('pets', checked as boolean)}
                />
                <label htmlFor={`pets-${ride.id}`} className="text-sm flex items-center">
                  <PawPrint className="h-3 w-3 mr-1" />
                  Pets allowed
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right ml-4">
          <div className="font-bold">₹{ride.price}</div>
          <Link to={`/published-rides/${ride.id}`}>
            <Button variant="ghost" size="sm" className="mt-2">
              View details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
