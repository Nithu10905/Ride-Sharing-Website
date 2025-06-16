import { Ride } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { MessageSquare, Phone, X, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import EditRideModal from "./EditRideModal";
import BookingRequestsCard from "./BookingRequestsCard";

interface PublishedRideDetailCardProps {
  ride: Ride;
}

export default function PublishedRideDetailCard({ ride }: PublishedRideDetailCardProps) {
  const { user } = useAuth();
  const { cancelRide, removePassenger } = useRides();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [passengerToRemove, setPassengerToRemove] = useState<string | null>(null);
  
  const departureDate = parseISO(ride.departureTime);
  const arrivalDate = parseISO(ride.arrivalTime);
  
  const formattedDepartureDate = format(departureDate, "EEE, dd MMM");
  const formattedDepartureTime = format(departureDate, "HH:mm");
  const formattedArrivalTime = format(arrivalDate, "HH:mm");

  const isCancelled = ride.status === 'cancelled';

  // Calculate total seats based on available seats and passengers
  const totalSeats = ride.availableSeats + (ride.passengers?.length || 0);

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

  const handleRemovePassenger = (passengerId: string, passengerName: string) => {
    setPassengerToRemove(passengerId);
    setShowRemoveDialog(true);
  };

  const confirmRemovePassenger = async () => {
    if (passengerToRemove) {
      const success = await removePassenger(ride.id, passengerToRemove);
      if (success) {
        setShowRemoveDialog(false);
        setPassengerToRemove(null);
      }
    }
  };

  const handleCancel = async () => {
    if (user && selectedReason) {
      const success = await cancelRide(ride.id, user.id, selectedReason);
      if (success) {
        setShowCancelDialog(false);
        navigate("/your-rides");
      }
    }
  };

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

        {/* Booking Requests Card */}
        {ride.bookingRequests && ride.bookingRequests.length > 0 && (
          <div className="mb-6">
            <BookingRequestsCard rideId={ride.id} requests={ride.bookingRequests} />
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

            {/* Passengers Section */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">
                Passengers ({ride.passengers?.length || 0}/{totalSeats})
              </h3>
              
              {ride.passengers && ride.passengers.length > 0 ? (
                <div className="space-y-3">
                  {ride.passengers.map((passenger) => (
                    <div key={passenger.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                            {passenger.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-800">{passenger.name}</div>
                          {passenger.phone && (
                            <div className="text-sm text-gray-500">{passenger.phone}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContactPassenger(passenger.id)}
                          className="flex items-center space-x-1"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Message</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleQuickCall(passenger)}
                          className="flex items-center space-x-1"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Call</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemovePassenger(passenger.id, passenger.name)}
                          className="flex items-center space-x-1 border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <UserMinus className="h-4 w-4" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No passengers have booked this ride yet.</p>
                </div>
              )}
            </div>

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

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Price per seat</div>
                <div className="text-3xl font-bold text-green-600">₹{ride.price}</div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center space-x-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <span>Edit Ride</span>
                </Button>
                {!isCancelled && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                    className="flex items-center space-x-2 border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel Ride</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Ride Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Ride</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                ⚠️ This will permanently cancel your ride and notify all passengers.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <div className="space-y-2">
                {cancelReasons.map((reason) => (
                  <label key={reason} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="text-red-600"
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="pt-4 space-y-3">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700" 
                onClick={handleCancel}
                disabled={!selectedReason}
              >
                Yes, Cancel Ride
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowCancelDialog(false);
                  setSelectedReason("");
                }}
              >
                Keep Ride
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Passenger Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Passenger</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ This will remove the passenger from your ride and notify them via message.
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this passenger from your ride?
            </p>
            
            <div className="pt-4 space-y-3">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700" 
                onClick={confirmRemovePassenger}
              >
                Yes, Remove Passenger
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowRemoveDialog(false);
                  setPassengerToRemove(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Ride Modal */}
      <EditRideModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        ride={ride}
      />
    </div>
  );
}
