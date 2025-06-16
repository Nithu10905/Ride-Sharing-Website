
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useRides } from '@/contexts/RideContext';
import { Ride } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { CheckCircle, CreditCard, Smartphone, IndianRupee } from 'lucide-react';

const PublishConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const { rides } = useRides();
  const [ride, setRide] = useState<Ride | null>(null);
  
  useEffect(() => {
    // In a real app, we would fetch this from MongoDB
    const fetchRide = async () => {
      try {
        // Find the ride in our local context for now
        const foundRide = rides.find(r => r.id === id);
        setRide(foundRide || null);
      } catch (error) {
        console.error('Error fetching ride details:', error);
      }
    };
    
    fetchRide();
  }, [id, rides]);

  const getPaymentIcon = (paymentType?: string) => {
    switch (paymentType) {
      case 'upi':
        return <Smartphone className="h-4 w-4 mr-2" />;
      case 'card':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'online':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'cash':
      default:
        return <IndianRupee className="h-4 w-4 mr-2" />;
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
  
  if (!ride) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ride not found</h2>
            <p className="text-gray-600 mb-4">
              The ride you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold">Your ride has been published!</h1>
                <p className="text-gray-600 mt-2">
                  Your ride from {ride.from.name} to {ride.to.name} is now live
                </p>
              </div>

              <div className="border rounded-lg p-4 mb-6">
                <h2 className="font-semibold text-lg mb-4">Ride plan</h2>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">
                    {format(parseISO(ride.departureTime), "EEEE, dd MMM")}
                  </div>
                  
                  <div className="grid grid-cols-[auto_1fr] gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="text-base font-medium">
                        {format(parseISO(ride.departureTime), "HH:mm")}
                      </div>
                      <div className="bg-gray-200 w-0.5 h-16 my-1"></div>
                      <div className="text-base font-medium">
                        {format(parseISO(ride.arrivalTime), "HH:mm")}
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="font-medium">{ride.from.name}</div>
                        <p className="text-sm text-gray-600">{ride.from.address}</p>
                      </div>
                      
                      <div>
                        <div className="font-medium">{ride.to.name}</div>
                        <p className="text-sm text-gray-600">{ride.to.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-gray-600">Price per seat</div>
                        <div className="text-lg font-bold">₹{ride.price.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Available seats</div>
                        <div className="text-lg font-bold">{ride.availableSeats}</div>
                      </div>
                    </div>

                    {/* Payment Type Display */}
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="text-gray-600">Payment method</div>
                      <div className="flex items-center">
                        {getPaymentIcon(ride.paymentType)}
                        <span className="font-medium">{getPaymentLabel(ride.paymentType)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link to={`/rides/${ride.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View ride details
                  </Button>
                </Link>
                <Link to="/your-rides" className="flex-1">
                  <Button className="w-full">
                    Go to your rides
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PublishConfirmation;
