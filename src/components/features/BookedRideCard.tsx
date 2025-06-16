import { Ride } from "@/types";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { X, MapPin, CheckCircle, Zap, Cigarette, PawPrint, Users, CreditCard, Smartphone, IndianRupee, MessageSquare, Phone, Star, Banknote } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RatingModal from "./RatingModal";
import { useToast } from "@/hooks/use-toast";

interface BookedRideCardProps {
  ride: Ride;
}

export default function BookedRideCard({ ride }: BookedRideCardProps) {
  const { user } = useAuth();
  const { cancelRide } = useRides();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [rated, setRated] = useState(false);
  
  const departureDate = parseISO(ride.departureTime);
  const arrivalDate = parseISO(ride.arrivalTime);
  const isCancelled = ride.status === 'cancelled';
  const isRideCompleted = new Date() > arrivalDate;
  
  // Check if driver is fully verified
  const isDriverVerified = ride.driver.email && ride.driver.phone && ride.driver.isIDVerified && ride.driver.isPhoneVerified;
  
  // Filter out current user from passengers list
  const filteredPassengers = ride.passengers?.filter(passenger => passenger.id !== user?.id) || [];

  const handleCancelRide = async () => {
    if (!user || !selectedReason) return;
    
    setIsConfirming(true);
    try {
      const success = await cancelRide(ride.id, user.id, selectedReason);
      if (success) {
        setShowCancelDialog(false);
        toast({
          title: "Ride Cancelled",
          description: "Your booking has been cancelled successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel the ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleContactDriver = () => {
    navigate(`/contact-driver/${ride.id}`);
  };

  const handleQuickCall = () => {
    if (ride.driver.phone) {
      window.open(`tel:${ride.driver.phone}`);
      toast({
        title: "Opening Phone",
        description: `Calling ${ride.driver.name}`,
      });
    } else {
      toast({
        title: "Phone Not Available",
        description: "Driver's phone number is not available.",
        variant: "destructive"
      });
    }
  };

  const handlePayNow = () => {
    switch (ride.paymentType) {
      case 'cash':
        toast({
          title: "Cash Payment",
          description: "Please pay in the car during your ride.",
        });
        break;
      case 'upi':
        // Redirect to PhonePe or Paytm
        const upiUrl = `upi://pay?pa=driver@upi&pn=${ride.driver.name}&am=${ride.price}&cu=INR&tn=RideShare Payment`;
        window.open(upiUrl, '_blank');
        toast({
          title: "UPI Payment",
          description: "Opening UPI app for payment...",
        });
        break;
      case 'card':
      case 'online':
        // Redirect to online payment gateway
        toast({
          title: "Online Payment",
          description: "Redirecting to payment gateway...",
        });
        // Here you would integrate with Stripe, Razorpay, etc.
        break;
      default:
        toast({
          title: "Payment Method",
          description: "Please contact the driver for payment details.",
        });
    }
  };

  const handleRateDriver = () => {
    if (!isRideCompleted) {
      toast({
        title: "Rating Not Available",
        description: "You can rate the driver after the ride is completed.",
        variant: "destructive"
      });
      return;
    }
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      // Here you would submit the rating to your backend
      console.log('Rating submitted:', { rating, comment, driverId: ride.driver.id });
      toast({
        title: "Rating Submitted",
        description: `Thank you for rating ${ride.driver.name}!`,
      });
      setShowRatingModal(false);
      setRated(true);
    } catch (error) {
      toast({
        title: "Rating Failed",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Add an effect to reset modal state when ride or modal changes
  useEffect(() => {
    if (!showRatingModal) {
      setSelectedReason("");
    }
  }, [showRatingModal, ride.id]);
  
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
        return 'UPI Payment';
      case 'card':
        return 'Card Payment';
      case 'online':
        return 'Online Payment';
      case 'cash':
      default:
        return 'Cash Payment';
    }
  };

  const getPaymentButtonText = (paymentType?: string) => {
    switch (paymentType) {
      case 'cash':
        return 'Pay in Car';
      case 'upi':
        return 'Pay via UPI';
      case 'card':
      case 'online':
        return 'Pay Online';
      default:
        return 'Pay Now';
    }
  };
  
  return (
    <>
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
            
            <div className="mt-3 flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{ride.driver.name}</span>
              {isDriverVerified && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Contact Actions */}
            <div className="mt-3 flex items-center space-x-2 flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleContactDriver}
                className="flex items-center space-x-1"
              >
                <MessageSquare className="h-3 w-3" />
                <span>Contact</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleQuickCall}
                className="flex items-center space-x-1"
              >
                <Phone className="h-3 w-3" />
                <span>Call</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRateDriver}
                className="flex items-center space-x-1 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                disabled={!isRideCompleted || rated}
              >
                <Star className="h-3 w-3" />
                <span>{rated ? "Rated" : "Rate Driver"}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePayNow}
                className="flex items-center space-x-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                disabled={isCancelled}
              >
                <Banknote className="h-3 w-3" />
                <span>{getPaymentButtonText(ride.paymentType)}</span>
              </Button>
            </div>

            {/* Other Passengers (excluding current user) */}
            {filteredPassengers.length > 0 && (
              <div className="mt-3 flex items-center">
                <Users className="h-4 w-4 text-gray-500 mr-2" />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Other passengers:</span>
                  <div className="flex space-x-1">
                    {filteredPassengers.map((passenger) => (
                      <div key={passenger.id} className="flex items-center space-x-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{passenger.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{passenger.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Type Display */}
            <div className="mt-2 flex items-center text-sm text-gray-600">
              {getPaymentIcon(ride.paymentType)}
              <span>{getPaymentLabel(ride.paymentType)}</span>
            </div>

            {/* Amenities Display */}
            <div className="mt-2 flex flex-wrap gap-2">
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
          
          <div className="text-right ml-4">
            <div className="font-bold">₹{ride.price}</div>
            <div className="flex flex-col space-y-2 mt-2">
              <Link to={`/rides/${ride.id}`}>
                <Button variant="ghost" size="sm">
                  View details
                </Button>
              </Link>
              {!isCancelled && !isRideCompleted && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Ride
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Ride Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Ride - What's the reason?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {[
              "I found another ride",
              "The car owner changed the date/schedule",
              "The car owner asked me to cancel",
              "The date is no longer suitable",
              "I made a mistake and shouldn't have booked",
              "I found another means of transportation",
              "The car owner is no longer offering the ride",
              "The car owner is unreachable",
              "Something came up, I'm no longer travelling at all",
              "The driver changed the pick-up point"
            ].map((reason) => (
              <div 
                key={reason}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedReason === reason 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedReason(reason)}
              >
                <span className="text-sm">{reason}</span>
              </div>
            ))}
            
            <div className="pt-4 flex space-x-2">
              <Button 
                variant="outline"
                className="flex-1" 
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Ride
              </Button>
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600" 
                disabled={!selectedReason || isConfirming} 
                onClick={handleCancelRide}
              >
                {isConfirming ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        driverName={ride.driver.name}
      />
    </>
  );
}
