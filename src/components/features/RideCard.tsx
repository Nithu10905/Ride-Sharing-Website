
import { Link } from "react-router-dom";
import { Ride } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Star, CheckCircle, Zap, Cigarette, PawPrint, MapPin, CreditCard, Smartphone, IndianRupee } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface RideCardProps {
  ride: Ride;
}

export default function RideCard({ ride }: RideCardProps) {
  const { user } = useAuth();
  const departureTime = parseISO(ride.departureTime);
  const arrivalTime = parseISO(ride.arrivalTime);

  const formattedDepartureTime = format(departureTime, "HH:mm");
  const formattedArrivalTime = format(arrivalTime, "HH:mm");

  // Check if driver is fully verified (email, phone, and ID)
  const isFullyVerified = ride.driver.email && ride.driver.phone && ride.driver.isIDVerified && ride.driver.isPhoneVerified;

  // Filter out current user from passengers list
  const filteredPassengers = ride.passengers?.filter(passenger => passenger.id !== user?.id) || [];

  const getPaymentIcon = (paymentType?: string) => {
    switch (paymentType) {
      case 'upi':
        return <Smartphone className="h-3 w-3 mr-1" />;
      case 'card':
        return <CreditCard className="h-3 w-3 mr-1" />;
      case 'online':
        return <CreditCard className="h-3 w-3 mr-1" />;
      case 'cash':
      default:
        return <IndianRupee className="h-3 w-3 mr-1" />;
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

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 grid grid-cols-[1fr_auto] gap-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{formattedDepartureTime}</span>
                <div className="flex-1 border-t border-dashed border-gray-300 h-px mx-2"></div>
                <span className="font-semibold">{formattedArrivalTime}</span>
              </div>
              <div className="flex mt-1">
                <div className="flex-1 flex justify-between">
                  <span className="text-sm text-gray-600">{ride.from.name}</span>
                  <span className="text-sm text-gray-600">{ride.to.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stopovers Display */}
          {ride.stopovers && ride.stopovers.length > 0 && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Stopovers:</span>
              <div className="flex flex-wrap gap-1">
                {ride.stopovers.map((stopover, index) => (
                  <span key={index} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {stopover}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{ride.driver.name}</span>
                {isFullyVerified && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {ride.driver.rating && (
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{ride.driver.rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Passengers Display - exclude current user */}
          {filteredPassengers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Passengers:</span>
              <div className="flex flex-wrap gap-2">
                {filteredPassengers.map((passenger, index) => (
                  <div key={passenger.id} className="flex items-center space-x-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{passenger.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{passenger.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities Section */}
          <div className="flex flex-wrap gap-2">
            {ride.instantBooking && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                Instant Booking
              </Badge>
            )}
            {ride.amenities?.smoking && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                <Cigarette className="h-3 w-3 mr-1" />
                Smoking allowed
              </Badge>
            )}
            {ride.amenities?.pets && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <PawPrint className="h-3 w-3 mr-1" />
                Pets allowed
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between items-end">
          <div className="text-xl font-bold">₹{ride.price}</div>
          {/* Payment Type Display */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            {getPaymentIcon(ride.paymentType)}
            <span>{getPaymentLabel(ride.paymentType)}</span>
          </div>
          <Link to={`/rides/${ride.id}`}>
            <Button size="sm" className="whitespace-nowrap">
              View details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
