
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useRides } from '@/contexts/RideContext';
import { Ride } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { CreditCard, Smartphone, IndianRupee } from 'lucide-react';

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const { rides } = useRides();
  const [ride, setRide] = useState<Ride | null>(null);
  const [message, setMessage] = useState('Hello, I\'ve just booked your ride! I\'d be glad to travel with you. Can I get more information on...?');
  
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
  
  const departureDate = parseISO(ride.departureTime);
  
  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Book online and secure your seat</h1>
              
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{format(departureDate, "EEE dd MMM")}</span>
                </div>
                
                <div className="grid grid-cols-[auto_1fr] gap-4">
                  <div>
                    <div className="font-medium">{format(parseISO(ride.departureTime), "HH:mm")}</div>
                    <div className="bg-gray-200 w-0.5 h-6 mx-auto my-1"></div>
                    <div className="font-medium">{format(parseISO(ride.arrivalTime), "HH:mm")}</div>
                  </div>
                  
                  <div>
                    <div>{ride.from.name}</div>
                    <div className="mt-auto">{ride.to.name}</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <h2 className="font-semibold mb-2">Price summary</h2>
                <div className="flex justify-between">
                  <span>1 seat: ₹{ride.price.toFixed(2)}</span>
                  <div className="flex items-center">
                    {getPaymentIcon(ride.paymentType)}
                    <span className="font-medium">{getPaymentLabel(ride.paymentType)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {ride.paymentType === 'cash' ? 'Pay in the car' : 
                   ride.paymentType === 'upi' ? 'Pay via UPI' :
                   'Pay online'}
                </p>
              </div>
              
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Send a message to {ride.driver.name} to introduce yourself</h2>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-32"
                />
              </div>
              
              <div className="text-center">
                <Link to="/your-rides">
                  <Button size="lg" className="px-12">Book</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
