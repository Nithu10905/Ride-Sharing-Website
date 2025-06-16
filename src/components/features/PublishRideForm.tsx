import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRides } from '@/contexts/RideContext';
import { useAuth } from '@/contexts/AuthContext';
import { Ride } from '@/types';
import { IDVerification } from './IDVerification';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function PublishRideForm() {
  const navigate = useNavigate();
  const { publishRide } = useRides();
  const { user } = useAuth();
  
  const [fromName, setFromName] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toName, setToName] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('3');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [instantBooking, setInstantBooking] = useState(true);
  const [paymentType, setPaymentType] = useState('cash');

  // Check if user is verified
  const isUserVerified = user?.isIDVerified || false;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check verification before allowing publish
    if (!isUserVerified) {
      return;
    }
    
    // Combine date and time for departure
    const departureDateObj = new Date(`${departureDate}T${departureTime}:00`);
    
    // Combine date and time for arrival
    const arrivalDateObj = new Date(`${departureDate}T${arrivalTime}:00`);

    try {
      const rideData: Omit<Ride, 'id' | 'driver' | 'status'> = {
        from: {
          name: fromName,
          address: fromAddress
        },
        to: {
          name: toName,
          address: toAddress
        },
        departureTime: departureDateObj.toISOString(),
        arrivalTime: arrivalDateObj.toISOString(),
        price: Number(price),
        availableSeats: Number(seats),
        vehicle: {
          make: vehicleMake,
          model: vehicleModel,
          color: vehicleColor
        },
        instantBooking,
        passengers: [],
        paymentType: paymentType as 'cash' | 'upi' | 'card' | 'online'
      };
      
      const newRide = await publishRide(rideData);
      navigate(`/publish-confirmation/${newRide.id}`);
    } catch (error) {
      console.error('Error publishing ride:', error);
    }
  };

  // Show verification prompt if user is not verified
  if (!isUserVerified) {
    return (
      <div className="space-y-6 bg-white p-8 rounded-xl shadow-2xl border-0">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Verification Required</h2>
          <p className="text-gray-600 mb-6">You need to verify your ID before you can publish rides.</p>
        </div>
        
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            For the safety and security of all users, ID verification is required to publish rides. This helps build trust in our community.
          </AlertDescription>
        </Alert>
        
        <IDVerification />
        
        <div className="text-center pt-6">
          <Button 
            variant="outline"
            onClick={() => navigate('/your-rides')}
            className="px-8"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePublish} className="space-y-8 bg-white p-8 rounded-xl shadow-2xl border-0">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Create a Ride</h2>
        <p className="text-gray-600 mb-6">Publish your ride with enhanced features and advanced booking options.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="from-name" className="text-sm font-semibold text-gray-700">From Location</Label>
            <Input
              id="from-name"
              placeholder="City or town name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="from-address" className="text-sm font-semibold text-gray-700">Address Details</Label>
            <Input
              id="from-address"
              placeholder="Street, area, landmark"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="to-name" className="text-sm font-semibold text-gray-700">To Location</Label>
            <Input
              id="to-name"
              placeholder="City or town name"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="to-address" className="text-sm font-semibold text-gray-700">Address Details</Label>
            <Input
              id="to-address"
              placeholder="Street, area, landmark"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="available-seats" className="text-sm font-semibold text-gray-700">Available Seats</Label>
            <Select value={seats} onValueChange={setSeats} required>
              <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                <SelectValue placeholder="Select seats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 seat</SelectItem>
                <SelectItem value="2">2 seats</SelectItem>
                <SelectItem value="3">3 seats</SelectItem>
                <SelectItem value="4">4 seats</SelectItem>
                <SelectItem value="5">5 seats</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Price per Seat (₹)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="payment-type" className="text-sm font-semibold text-gray-700">Payment Method</Label>
            <Select value={paymentType} onValueChange={setPaymentType} required>
              <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash Payment</SelectItem>
                <SelectItem value="upi">UPI Payment</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              <Label htmlFor="departure-date" className="text-sm font-semibold text-gray-700">Departure Date</Label>
              <Input
                id="departure-date"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <Label htmlFor="departure-time" className="text-sm font-semibold text-gray-700">Departure</Label>
                <Input
                  id="departure-time"
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="arrival-time" className="text-sm font-semibold text-gray-700">Arrival</Label>
                <Input
                  id="arrival-time"
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="vehicle-make">Make</Label>
            <Input
              id="vehicle-make"
              placeholder="Toyota, Honda, etc."
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="vehicle-model">Model</Label>
            <Input
              id="vehicle-model"
              placeholder="Corolla, Civic, etc."
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="vehicle-color">Color</Label>
            <Input
              id="vehicle-color"
              placeholder="White, Black, etc."
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="instant-booking"
            checked={instantBooking}
            onChange={(e) => setInstantBooking(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-blue-500 text-blue-600 focus:ring-blue-500 focus:ring-2"
          />
          <Label htmlFor="instant-booking" className="font-semibold text-gray-700">
            Enable instant booking (passengers can book without your approval)
          </Label>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Publish Ride
      </Button>
    </form>
  );
}
