import { Ride } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Star, MessageSquare, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RatingModal from "./RatingModal";
import ReportModal from "./ReportModal";
import { ratingService } from "@/services/ratingService";
import { useToast } from "@/hooks/use-toast";

interface RideDetailCardProps {
  ride: Ride;
}

export default function RideDetailCard({ ride }: RideDetailCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { bookRide, cancelBooking } = useRides();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [userRating, setUserRating] = useState<number | null>(null);
  
  const departureDate = parseISO(ride.departureTime);
  const arrivalDate = parseISO(ride.arrivalTime);
  
  const formattedDepartureDate = format(departureDate, "EEE, dd MMM");
  const formattedDepartureTime = format(departureDate, "HH:mm");
  const formattedArrivalTime = format(arrivalDate, "HH:mm");

  // Check if user has booked this ride
  const isBookedRide = user && ride.passengers?.some(p => 
    p.id === user.id || 
    p.email === user.email ||
    (typeof p === 'string' && p === user.id)
  );
  
  const isCancelled = ride.status === 'cancelled';
  const isRideCompleted = new Date() > arrivalDate;

  // Load user's rating for this ride
  useEffect(() => {
    const loadUserRating = async () => {
      if (user && isBookedRide && isRideCompleted) {
        try {
          const ratings = await ratingService.getRatingsByRide(ride.id);
          const userRatingData = ratings.find(r => r.rater.id === user.id);
          if (userRatingData) {
            setUserRating(userRatingData.rating);
          }
        } catch (error) {
          console.error('Error loading user rating:', error);
        }
      }
    };
    
    loadUserRating();
  }, [user, ride.id, isBookedRide, isRideCompleted]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/rides/${ride.id}` } });
      return;
    }
    
    if (user) {
      const success = await bookRide(ride.id, user);
      if (success) {
        navigate(`/booking-confirmation/${ride.id}`);
      }
    }
  };

  const handleCancelBooking = async () => {
    if (user && selectedReason) {
      const success = await cancelBooking(ride.id, user.id, selectedReason);
      if (success) {
        setShowCancelDialog(false);
        setSelectedReason("");
      }
    }
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!user) return;
    
    try {
      await ratingService.submitRating({
        raterId: user.id,
        rateeId: ride.driver.id,
        rideId: ride.id,
        rating,
        comment,
        type: 'driver'
      });
      
      setUserRating(rating);
      toast({
        title: "Rating Submitted",
        description: "Thank you for rating your ride experience!",
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Rating Failed",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReportSubmit = async (reason: string, details: string) => {
    if (!user) return;
    
    try {
      console.log('Report submitted:', { reason, details, rideId: ride.id });
      toast({
        title: "Report Submitted",
        description: "Thank you for your report. We will review it shortly.",
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Report Failed",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cancellation reasons for passengers
  const cancelReasons = [
    "Change of plans",
    "Found another ride", 
    "Emergency came up",
    "Date is no longer suitable",
    "Made a mistake booking",
    "Other transportation found",
    "Driver changed details",
    "Driver is unreachable",
    "No longer travelling",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <span>← Back</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Status Messages */}
        {isCancelled && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-1">This ride has been cancelled</h3>
            <p className="text-sm text-red-600">
              {ride.cancelReason ? `Reason: ${ride.cancelReason}` : 'No reason provided'}
            </p>
          </div>
        )}

        {isBookedRide && !isCancelled && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800">You have booked this ride</h3>
            <p className="text-sm text-green-600">Your booking is confirmed</p>
          </div>
        )}

        {/* Main Ride Card */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Date Header */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <h1 className="text-xl font-semibold text-gray-800">{formattedDepartureDate}</h1>
          </div>

          <div className="p-6">
            {/* Route Timeline */}
            <div className="mb-8">
              <div className="relative">
                {/* Departure */}
                <div className="flex items-start mb-6">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                  </div>
                  <div className="flex-1 pt-0">
                    <div className="text-lg font-semibold text-gray-800 mb-1">{formattedDepartureTime}</div>
                    <div className="font-medium text-gray-700 mb-1">{ride.from.name}</div>
                    <div className="text-sm text-gray-500">{ride.from.address}</div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 pt-0">
                    <div className="text-lg font-semibold text-gray-800 mb-1">{formattedArrivalTime}</div>
                    <div className="font-medium text-gray-700 mb-1">{ride.to.name}</div>
                    <div className="text-sm text-gray-500">{ride.to.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Section */}
            {ride.driver && (
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold text-lg">
                        {ride.driver.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold text-lg text-gray-800">
                        {ride.driver.name}
                      </div>
                      {ride.driver.rating && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{ride.driver.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isAuthenticated && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/contact-driver/${ride.id}`)}
                        className="flex items-center space-x-1"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Contact</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowReportModal(true)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {ride.vehicle && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">Vehicle:</span> {ride.vehicle.make} {ride.vehicle.model} - {ride.vehicle.color}
                  </div>
                )}
              </div>
            )}

            {/* Ride Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-600">Available Seats</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{ride.availableSeats}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-600">Payment</span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {ride.paymentType === 'upi' ? 'UPI Payment' : 
                   ride.paymentType === 'card' ? 'Card Payment' : 
                   ride.paymentType === 'online' ? 'Online Payment' : 'Cash Payment'}
                </div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Price per seat</div>
                <div className="text-3xl font-bold text-green-600">₹{ride.price}</div>
              </div>
              
              <div className="flex flex-col space-y-2">
                {isBookedRide ? (
                  // Booked passenger actions
                  <Button 
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                    className="flex items-center space-x-2 border-red-500 text-red-600 hover:bg-red-50"
                    disabled={isCancelled}
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel Booking</span>
                  </Button>
                ) : (
                  // Regular user - show book button
                  <Button 
                    size="lg" 
                    onClick={handleBooking}
                    disabled={ride.availableSeats < 1 || isCancelled}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelled ? "Ride Cancelled" : 
                     ride.availableSeats < 1 ? "No seats available" : "Book Now"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Dialog - Only for passengers */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Your Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please select a reason for cancelling:
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cancelReasons.map((reason) => (
                <div 
                  key={reason}
                  className={`p-3 border rounded-md flex justify-between items-center cursor-pointer transition-colors ${
                    selectedReason === reason 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedReason(reason)}
                >
                  <span className="text-sm">{reason}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 space-y-3">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700" 
                disabled={!selectedReason} 
                onClick={handleCancelBooking}
              >
                Confirm Cancellation
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowCancelDialog(false);
                  setSelectedReason("");
                }}
              >
                Keep Booking
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

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        rideName={`${ride.from.name} to ${ride.to.name}`}
      />
    </div>
  );
}
