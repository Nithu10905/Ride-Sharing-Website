import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Ride, User, BookingRequest } from '../types';
import { mockRides } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';
import { RidesCollection } from '@/lib/mongodb';

interface RideContextType {
  rides: Ride[];
  userRides: Ride[];
  bookedRides: Ride[];
  searchRides: (from: string, to: string) => Promise<Ride[]>;
  publishRide: (rideDetails: Omit<Ride, 'id' | 'driver' | 'status'>) => Promise<Ride>;
  bookRide: (rideId: string, user: User, message?: string) => Promise<boolean>;
  cancelRide: (rideId: string, userId: string, reason: string) => Promise<boolean>;
  cancelBooking: (rideId: string, userId: string, reason: string) => Promise<boolean>;
  updateRideAmenities: (rideId: string, amenities: any, instantBooking: boolean) => Promise<boolean>;
  updateRideDetails: (rideId: string, rideDetails: any) => Promise<boolean>;
  removePassenger: (rideId: string, passengerId: string) => Promise<boolean>;
  handleBookingRequest: (rideId: string, requestId: string, action: 'accept' | 'decline') => Promise<boolean>;
  setMessageSender?: (sendSystemMessage: (recipientId: string, content: string, rideId?: string) => Promise<void>) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

const RIDES_STORAGE_KEY = 'rideshare_rides';
const USER_RIDES_STORAGE_KEY = 'rideshare_user_rides';
const BOOKED_RIDES_STORAGE_KEY = 'rideshare_booked_rides';

export const RideProvider = ({ children }: { children: ReactNode }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [userRides, setUserRides] = useState<Ride[]>([]);
  const [bookedRides, setBookedRides] = useState<Ride[]>([]);
  const [messageSender, setMessageSender] = useState<((recipientId: string, content: string, rideId?: string) => Promise<void>) | null>(null);
  const { toast } = useToast();

  // Helper function to remove ride from all storage
  const removeRideFromStorage = (rideId: string) => {
    const updatedRides = rides.filter(ride => ride.id !== rideId);
    setRides(updatedRides);
    localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));

    const updatedUserRides = userRides.filter(ride => ride.id !== rideId);
    setUserRides(updatedUserRides);
    localStorage.setItem(USER_RIDES_STORAGE_KEY, JSON.stringify(updatedUserRides));

    const updatedBookedRides = bookedRides.filter(ride => ride.id !== rideId);
    setBookedRides(updatedBookedRides);
    localStorage.setItem(BOOKED_RIDES_STORAGE_KEY, JSON.stringify(updatedBookedRides));
  };

  // Load rides from storage or mock data on mount
  useEffect(() => {
    const loadRides = async () => {
      try {
        // Try to load from MongoDB first
        const dbRides = await RidesCollection.getAllRides();
        
        if (dbRides && dbRides.length > 0) {
          console.log('Loaded rides from MongoDB:', dbRides.length);
          setRides(dbRides as Ride[]);
        } else {
          // Fall back to local storage
          const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
          if (storedRides) {
            setRides(JSON.parse(storedRides));
          } else {
            // Fall back to mock data
            setRides(mockRides);
            // Save mock data to storage
            localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(mockRides));
          }
        }

        // Load user rides and booked rides
        const storedUserRides = localStorage.getItem(USER_RIDES_STORAGE_KEY);
        const storedBookedRides = localStorage.getItem(BOOKED_RIDES_STORAGE_KEY);
        
        if (storedUserRides) setUserRides(JSON.parse(storedUserRides));
        if (storedBookedRides) setBookedRides(JSON.parse(storedBookedRides));
        
      } catch (error) {
        console.error("Error loading rides:", error);
        // Fall back to mock data if there's an error
        setRides(mockRides);
      }
    };
    
    loadRides();
  }, []);

  // Save rides to storage whenever they change
  useEffect(() => {
    if (rides.length > 0) {
      localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(rides));
    }
  }, [rides]);

  useEffect(() => {
    if (userRides.length > 0) {
      localStorage.setItem(USER_RIDES_STORAGE_KEY, JSON.stringify(userRides));
    }
  }, [userRides]);

  useEffect(() => {
    if (bookedRides.length > 0) {
      localStorage.setItem(BOOKED_RIDES_STORAGE_KEY, JSON.stringify(bookedRides));
    }
  }, [bookedRides]);

  const setMessageSenderRef = (sendSystemMessage: (recipientId: string, content: string, rideId?: string) => Promise<void>) => {
    setMessageSender(() => sendSystemMessage);
  };

  const searchRides = async (from: string, to: string): Promise<Ride[]> => {
    try {
      console.log(`Searching rides from ${from} to ${to}`);
      
      const dbResults = await RidesCollection.searchRides(from, to);
      
      if (dbResults && dbResults.length > 0) {
        console.log('Found rides in MongoDB:', dbResults.length);
        return (dbResults as Ride[]).filter(ride => {
          const isActive = ride.status === 'active';
          console.log('Filtering ride:', ride.id, 'isActive:', isActive);
          return isActive;
        });
      }
      
      const filteredRides = rides.filter(ride => {
        const fromMatch = ride.from.name.toLowerCase().includes(from.toLowerCase());
        const toMatch = ride.to.name.toLowerCase().includes(to.toLowerCase());
        const isActive = ride.status === 'active';
        
        console.log('Local filtering ride:', ride.id, 'matches:', fromMatch && toMatch, 'isActive:', isActive);
        return fromMatch && toMatch && isActive;
      });
      
      console.log('Filtered rides (including all active rides):', filteredRides.length);
      return filteredRides;
    } catch (error) {
      console.error("Error searching rides:", error);
      toast({
        title: "Search failed",
        description: "There was an error searching for rides.",
        variant: "destructive",
      });
      return [];
    }
  };

  const publishRide = async (rideDetails: Omit<Ride, 'id' | 'driver' | 'status'>): Promise<Ride> => {
    try {
      const newRide: Ride = {
        ...rideDetails,
        id: `ride-${Date.now()}`,
        driver: { id: "user-1", name: "Current User", email: "user@example.com" },
        status: 'active',
        bookingRequests: [],
      };
      
      let savedRide = null;
      try {
        savedRide = await RidesCollection.createRide(newRide);
        console.log('Ride saved to MongoDB:', savedRide);
      } catch (mongoError) {
        console.error("MongoDB save failed, falling back to local storage:", mongoError);
      }
      
      const finalRide = savedRide || newRide;
      
      setRides(prevRides => [...prevRides, finalRide]);
      setUserRides(prevRides => [...prevRides, finalRide]);
      
      if (messageSender) {
        await messageSender(
          finalRide.driver.id,
          `🎉 Your ride from ${finalRide.from.name} to ${finalRide.to.name} has been successfully published! Passengers can now find and book your ride.`,
          finalRide.id
        );
      }
      
      toast({
        title: "Ride published successfully",
        description: "Your ride has been published and is now visible to others.",
      });
      
      return finalRide;
    } catch (error) {
      console.error("Error publishing ride:", error);
      toast({
        title: "Failed to publish ride",
        description: "There was an error publishing your ride. Please try again.",
        variant: "destructive",
      });
      throw new Error("Failed to publish ride");
    }
  };

  const bookRide = async (rideId: string, user: User, message?: string): Promise<boolean> => {
    try {
      const rideToBook = rides.find(ride => ride.id === rideId);
      if (!rideToBook) {
        throw new Error("Ride not found");
      }
      
      // Check if instant booking is enabled
      if (rideToBook.instantBooking) {
        // Instant booking - directly add passenger
        if (rideToBook.availableSeats < 1) {
          throw new Error("No seats available");
        }
        
        const updatedRide: Ride = {
          ...rideToBook,
          availableSeats: rideToBook.availableSeats - 1,
          passengers: [...(rideToBook.passengers || []), user]
        };
        
        let savedRide = null;
        try {
          savedRide = await RidesCollection.updateRide(rideId, updatedRide);
          console.log('Ride updated in MongoDB:', savedRide);
        } catch (mongoError) {
          console.error("MongoDB update failed, falling back to local storage:", mongoError);
        }
        
        const finalRide = savedRide || updatedRide;
        
        setRides(prevRides => 
          prevRides.map(ride => ride.id === rideId ? finalRide : ride)
        );
        
        const bookedRideForUser = { ...finalRide, status: 'active' as const };
        setBookedRides(prevRides => [...prevRides, bookedRideForUser]);
        
        if (messageSender) {
          await messageSender(
            rideToBook.driver.id,
            `🚗 New booking! ${user.name} has booked a seat on your ride from ${rideToBook.from.name} to ${rideToBook.to.name}. Contact details: ${user.email}${user.phone ? `, ${user.phone}` : ''}`,
            rideId
          );
          
          await messageSender(
            user.id,
            `✅ Booking confirmed! You've successfully booked a ride from ${rideToBook.from.name} to ${rideToBook.to.name} with ${rideToBook.driver.name}. Driver contact: ${rideToBook.driver.email}`,
            rideId
          );
        }
        
        toast({
          title: "Booking confirmed!",
          description: `You've successfully booked this ride from ${rideToBook.from.name} to ${rideToBook.to.name}.`,
        });
        
        return true;
      } else {
        // Request-based booking - create a booking request
        const bookingRequest: BookingRequest = {
          id: `request-${Date.now()}`,
          passenger: user,
          status: 'pending',
          requestTime: new Date().toISOString(),
          message
        };
        
        const updatedRide: Ride = {
          ...rideToBook,
          bookingRequests: [...(rideToBook.bookingRequests || []), bookingRequest]
        };
        
        let savedRide = null;
        try {
          savedRide = await RidesCollection.updateRide(rideId, updatedRide);
          console.log('Booking request saved to MongoDB:', savedRide);
        } catch (mongoError) {
          console.error("MongoDB update failed, falling back to local storage:", mongoError);
        }
        
        const finalRide = savedRide || updatedRide;
        
        setRides(prevRides => 
          prevRides.map(ride => ride.id === rideId ? finalRide : ride)
        );
        
        setUserRides(prevRides => 
          prevRides.map(ride => ride.id === rideId ? finalRide : ride)
        );
        
        if (messageSender) {
          await messageSender(
            rideToBook.driver.id,
            `📋 New booking request! ${user.name} wants to book a seat on your ride from ${rideToBook.from.name} to ${rideToBook.to.name}. Please check your ride details to accept or decline.`,
            rideId
          );
          
          await messageSender(
            user.id,
            `📋 Booking request sent! Your request to book the ride from ${rideToBook.from.name} to ${rideToBook.to.name} has been sent to ${rideToBook.driver.name}. You'll be notified once they respond.`,
            rideId
          );
        }
        
        toast({
          title: "Booking request sent!",
          description: "Your booking request has been sent to the driver. You'll be notified once they respond.",
        });
        
        return true;
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Failed to book this ride. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleBookingRequest = async (rideId: string, requestId: string, action: 'accept' | 'decline'): Promise<boolean> => {
    try {
      const rideToUpdate = rides.find(ride => ride.id === rideId);
      if (!rideToUpdate) {
        throw new Error("Ride not found");
      }

      const request = rideToUpdate.bookingRequests?.find(req => req.id === requestId);
      if (!request) {
        throw new Error("Booking request not found");
      }

      if (action === 'accept') {
        if (rideToUpdate.availableSeats < 1) {
          throw new Error("No seats available");
        }

        // Update the ride: add passenger, reduce available seats, update request status
        const updatedRide: Ride = {
          ...rideToUpdate,
          availableSeats: rideToUpdate.availableSeats - 1,
          passengers: [...(rideToUpdate.passengers || []), request.passenger],
          bookingRequests: rideToUpdate.bookingRequests?.map(req => 
            req.id === requestId ? { ...req, status: 'accepted' as const } : req
          )
        };

        setRides(prevRides => 
          prevRides.map(ride => ride.id === rideId ? updatedRide : ride)
        );

        setUserRides(prevRides => 
          prevRides.map(ride => ride.id === rideId ? updatedRide : ride)
        );

        // Add to passenger's booked rides
        const bookedRideForPassenger = { ...updatedRide, status: 'active' as const };
        setBookedRides(prevRides => [...prevRides, bookedRideForPassenger]);

        if (messageSender) {
          await messageSender(
            request.passenger.id,
            `✅ Booking accepted! Your request for the ride from ${rideToUpdate.from.name} to ${rideToUpdate.to.name} has been accepted by ${rideToUpdate.driver.name}. Driver contact: ${rideToUpdate.driver.email}`,
            rideId
          );
        }

        toast({
          title: "Request accepted",
          description: `${request.passenger.name}'s booking request has been accepted.`,
        });
      } else {
        // Decline the request
        const updatedRide: Ride = {
          ...rideToUpdate,
          bookingRequests: rideToUpdate.bookingRequests?.map(req => 
            req.id === requestId ? { ...req, status: 'declined' as const } : req
          )
        };

        setRides(prevRides => 
          prevRides.map(ride => ride.id === rideId ? updatedRide : ride)
        );

        setUserRides(prevRides => 
          prevRides.map(ride => ride.id === rideId ? updatedRide : ride)
        );

        if (messageSender) {
          await messageSender(
            request.passenger.id,
            `❌ Booking declined: Your request for the ride from ${rideToUpdate.from.name} to ${rideToUpdate.to.name} has been declined by ${rideToUpdate.driver.name}. Please try other available rides.`,
            rideId
          );
        }

        toast({
          title: "Request declined",
          description: `${request.passenger.name}'s booking request has been declined.`,
        });
      }

      try {
        const updatedRide = rides.find(r => r.id === rideId);
        if (updatedRide) {
          await RidesCollection.updateRide(rideId, updatedRide);
          console.log('Booking request response saved to MongoDB');
        }
      } catch (mongoError) {
        console.error("MongoDB update failed for booking request:", mongoError);
      }

      return true;
    } catch (error) {
      console.error("Error handling booking request:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to handle booking request.",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelBooking = async (rideId: string, userId: string, reason: string): Promise<boolean> => {
    try {
      const bookedRide = bookedRides.find(ride => ride.id === rideId);
      if (!bookedRide) {
        throw new Error("Booked ride not found");
      }
      
      const passenger = bookedRide.passengers?.find(p => p.id === userId);
      const passengerName = passenger?.name || "A passenger";
      
      const updatedBookedRides = bookedRides.map(ride => {
        if (ride.id === rideId) {
          return {
            ...ride,
            status: 'cancelled' as const,
            cancelReason: reason
          };
        }
        return ride;
      });
      
      setBookedRides(updatedBookedRides);
      
      if (messageSender) {
        await messageSender(
          bookedRide.driver.id,
          `❌ Booking cancelled: ${passengerName} has cancelled their booking for your ride from ${bookedRide.from.name} to ${bookedRide.to.name}. Reason: ${reason}`,
          rideId
        );
        
        await messageSender(
          userId,
          `✅ Booking cancelled: You have successfully cancelled your booking for the ride from ${bookedRide.from.name} to ${bookedRide.to.name}. Reason: ${reason}`,
          rideId
        );
      }
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Cancellation failed",
        description: error instanceof Error ? error.message : "Failed to cancel this booking. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelRide = async (rideId: string, userId: string, reason: string): Promise<boolean> => {
    try {
      const rideToCancel = rides.find(ride => ride.id === rideId);
      
      if (!rideToCancel) {
        throw new Error("Ride not found");
      }

      const isDriverCancelling = rideToCancel.driver.id === userId;

      if (isDriverCancelling) {
        try {
          await RidesCollection.updateRide(rideId, {
            ...rideToCancel,
            status: 'cancelled' as const,
            cancelReason: reason
          });
          console.log('Ride marked as cancelled in MongoDB');
        } catch (mongoError) {
          console.error("MongoDB update failed after driver cancellation:", mongoError);
        }

        removeRideFromStorage(rideId);

        if (messageSender && rideToCancel.passengers) {
          for (const passenger of rideToCancel.passengers) {
            await messageSender(
              passenger.id,
              `❌ Ride cancelled: The driver has cancelled the ride from ${rideToCancel.from.name} to ${rideToCancel.to.name}. Reason: ${reason}`,
              rideId
            );
          }
        }

        toast({
          title: "Ride Cancelled",
          description: "Your ride has been cancelled and removed completely.",
        });

        return true;
      } else {
        throw new Error("Only the driver can cancel the entire ride");
      }
    } catch (error) {
      console.error("Error cancelling ride:", error);
      toast({
        title: "Cancellation failed",
        description: error instanceof Error ? error.message : "Failed to cancel this ride. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removePassenger = async (rideId: string, passengerId: string): Promise<boolean> => {
    try {
      const rideToUpdate = rides.find(ride => ride.id === rideId);
      if (!rideToUpdate) {
        throw new Error("Ride not found");
      }

      const passengerToRemove = rideToUpdate.passengers?.find(p => p.id === passengerId);
      if (!passengerToRemove) {
        throw new Error("Passenger not found");
      }

      const updatedRide = {
        ...rideToUpdate,
        availableSeats: rideToUpdate.availableSeats + 1,
        passengers: (rideToUpdate.passengers || []).filter(p => p.id !== passengerId)
      };

      setRides(prevRides => 
        prevRides.map(ride => ride.id === rideId ? updatedRide : ride)
      );

      setUserRides(prevRides => 
        prevRides.map(ride => ride.id === rideId ? updatedRide : ride)
      );

      // Remove the ride from the passenger's booked rides list
      setBookedRides(prevBookedRides => 
        prevBookedRides.filter(ride => !(ride.id === rideId && ride.passengers?.some(p => p.id === passengerId)))
      );

      try {
        await RidesCollection.updateRide(rideId, updatedRide);
        console.log('Passenger removed from ride in MongoDB');
      } catch (mongoError) {
        console.error("MongoDB update failed after removing passenger:", mongoError);
      }

      if (messageSender) {
        await messageSender(
          passengerId,
          `❌ You have been removed from the ride from ${rideToUpdate.from.name} to ${rideToUpdate.to.name} by the driver. Please contact the driver if you have any questions.`,
          rideId
        );
      }

      toast({
        title: "Passenger Removed",
        description: `${passengerToRemove.name} has been removed from the ride.`,
      });

      return true;
    } catch (error) {
      console.error("Error removing passenger:", error);
      toast({
        title: "Failed to remove passenger",
        description: error instanceof Error ? error.message : "Failed to remove passenger. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateRideAmenities = async (rideId: string, amenities: any, instantBooking: boolean): Promise<boolean> => {
    try {
      const updatedRides = rides.map(ride => {
        if (ride.id === rideId) {
          return {
            ...ride,
            amenities,
            instantBooking
          };
        }
        return ride;
      });

      const updatedUserRides = userRides.map(ride => {
        if (ride.id === rideId) {
          return {
            ...ride,
            amenities,
            instantBooking
          };
        }
        return ride;
      });

      setRides(updatedRides);
      setUserRides(updatedUserRides);

      try {
        const updatedRide = updatedRides.find(r => r.id === rideId);
        if (updatedRide) {
          await RidesCollection.updateRide(rideId, updatedRide);
          console.log('Ride amenities updated in MongoDB');
        }
      } catch (mongoError) {
        console.error("MongoDB update failed for amenities:", mongoError);
      }

      return true;
    } catch (error) {
      console.error("Error updating ride amenities:", error);
      toast({
        title: "Update failed",
        description: "Failed to update ride amenities. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateRideDetails = async (rideId: string, rideDetails: any): Promise<boolean> => {
    try {
      const rideIndex = rides.findIndex(ride => ride.id === rideId);
      const userRideIndex = userRides.findIndex(ride => ride.id === rideId);
      
      if (rideIndex === -1) {
        throw new Error("Ride not found");
      }

      const updatedRides = [...rides];
      updatedRides[rideIndex] = {
        ...updatedRides[rideIndex],
        ...rideDetails
      };

      const updatedUserRides = [...userRides];
      if (userRideIndex !== -1) {
        updatedUserRides[userRideIndex] = {
          ...updatedUserRides[userRideIndex],
          ...rideDetails
        };
      }

      setRides(updatedRides);
      setUserRides(updatedUserRides);

      try {
        const updatedRide = updatedRides[rideIndex];
        await RidesCollection.updateRide(rideId, updatedRide);
        console.log('Ride details updated in MongoDB');
      } catch (mongoError) {
        console.error("MongoDB update failed for ride details:", mongoError);
      }

      toast({
        title: "Ride Updated",
        description: "Your ride details have been updated successfully.",
      });

      return true;
    } catch (error) {
      console.error("Error updating ride details:", error);
      toast({
        title: "Update failed",
        description: "Failed to update ride details. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <RideContext.Provider 
      value={{ 
        rides, 
        userRides, 
        bookedRides, 
        searchRides, 
        publishRide, 
        bookRide,
        cancelRide,
        cancelBooking,
        updateRideAmenities,
        updateRideDetails,
        removePassenger,
        handleBookingRequest,
        setMessageSender: setMessageSenderRef
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRides = (): RideContextType => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
};

export default RideProvider;
