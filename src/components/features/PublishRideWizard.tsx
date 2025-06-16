import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, CarFront, Calendar as CalendarIcon, Plus, Minus, MapPin, X, AlertCircle } from "lucide-react";
import { useRides } from '@/contexts/RideContext';
import { useAuth } from '@/contexts/AuthContext';
import { Ride } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IDVerification } from './IDVerification';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Stopover {
  id: string;
  name: string;
  address: string;
}

export default function PublishRideWizard() {
  const navigate = useNavigate();
  const { publishRide } = useRides();
  const { user } = useAuth();
  
  // Check if user is verified
  const isUserVerified = user?.isIDVerified || false;
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form data
  const [fromName, setFromName] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toName, setToName] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [stopovers, setStopovers] = useState<Stopover[]>([]);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [departureTime, setDepartureTime] = useState('17:00');
  const [seats, setSeats] = useState(3);
  const [maxTwoInBack, setMaxTwoInBack] = useState(false);
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [price, setPrice] = useState('');
  const [instantBooking, setInstantBooking] = useState(true);
  const [paymentType, setPaymentType] = useState('cash');

  // Enhanced city suggestions
  const fromSuggestions = [
    { name: 'Mumbai, Maharashtra', address: 'Mumbai, Maharashtra, India' },
    { name: 'Delhi, Delhi', address: 'Delhi, Delhi, India' },
    { name: 'Bangalore, Karnataka', address: 'Bangalore, Karnataka, India' },
    { name: 'Hyderabad, Telangana', address: 'Hyderabad, Telangana, India' },
    { name: 'Chennai, Tamil Nadu', address: 'Chennai, Tamil Nadu, India' },
    { name: 'Kolkata, West Bengal', address: 'Kolkata, West Bengal, India' },
    { name: 'Pune, Maharashtra', address: 'Pune, Maharashtra, India' },
    { name: 'Ahmedabad, Gujarat', address: 'Ahmedabad, Gujarat, India' },
    { name: 'Kurnool, Andhra Pradesh', address: 'Kurnool, Andhra Pradesh, India' },
    { name: 'Kadapa, Andhra Pradesh', address: 'Kadapa, Andhra Pradesh, India' },
  ];
  
  const toSuggestions = [
    { name: 'Goa, Goa', address: 'Goa, Goa, India' },
    { name: 'Mysore, Karnataka', address: 'Mysore, Karnataka, India' },
    { name: 'Coimbatore, Tamil Nadu', address: 'Coimbatore, Tamil Nadu, India' },
    { name: 'Kochi, Kerala', address: 'Kochi, Kerala, India' },
    { name: 'Jaipur, Rajasthan', address: 'Jaipur, Rajasthan, India' },
    { name: 'Lucknow, Uttar Pradesh', address: 'Lucknow, Uttar Pradesh, India' },
    { name: 'Surat, Gujarat', address: 'Surat, Gujarat, India' },
    { name: 'Indore, Madhya Pradesh', address: 'Indore, Madhya Pradesh, India' },
    { name: 'Kadapa, Andhra Pradesh', address: 'Kadapa, Andhra Pradesh, India' },
    { name: 'Tirupati, Andhra Pradesh', address: 'Tirupati, Andhra Pradesh, India' },
  ];
  
  const stopoverSuggestions = [
    { name: 'Anantapur, Andhra Pradesh', address: 'Anantapur, Andhra Pradesh, India' },
    { name: 'Kurnool, Andhra Pradesh', address: 'Kurnool, Andhra Pradesh, India' },
    { name: 'Bellary, Karnataka', address: 'Bellary, Karnataka, India' },
    { name: 'Chitradurga, Karnataka', address: 'Chitradurga, Karnataka, India' },
    { name: 'Tumkur, Karnataka', address: 'Tumkur, Karnataka, India' },
    { name: 'Hubli, Karnataka', address: 'Hubli, Karnataka, India' },
  ];

  // Generate 24-hour time options
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });
  
  // Handle selection of suggestions
  const selectFromSuggestion = (suggestion: { name: string; address: string }) => {
    setFromName(suggestion.name);
    setFromAddress(suggestion.address);
    setCurrentStep(1);
  };
  
  const selectToSuggestion = (suggestion: { name: string; address: string }) => {
    setToName(suggestion.name);
    setToAddress(suggestion.address);
  };

  const addStopover = (suggestion: { name: string; address: string }) => {
    const newStop: Stopover = {
      id: Math.random().toString(36).substr(2, 9),
      name: suggestion.name,
      address: suggestion.address
    };
    setStopovers([...stopovers, newStop]);
  };

  const removeStopover = (id: string) => {
    setStopovers(stopovers.filter(stop => stop.id !== id));
  };
  
  const increaseSeats = () => {
    if (seats < 8) setSeats(seats + 1);
  };
  
  const decreaseSeats = () => {
    if (seats > 1) setSeats(seats - 1);
  };
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePublish = async () => {
    // Check verification before allowing publish
    if (!isUserVerified) {
      return;
    }
    
    try {
      if (!departureDate) {
        alert("Please select a departure date");
        return;
      }
      
      const dateStr = format(departureDate, 'yyyy-MM-dd');
      const departureDateObj = new Date(`${dateStr}T${departureTime}:00`);
      
      const arrivalTime = new Date(departureDateObj);
      arrivalTime.setHours(arrivalTime.getHours() + 2);
      
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
        arrivalTime: arrivalTime.toISOString(),
        price: Number(price) || 500,
        availableSeats: seats,
        vehicle: {
          make: vehicleMake,
          model: vehicleModel,
          color: vehicleColor
        },
        instantBooking,
        passengers: [],
        paymentType: paymentType as 'cash' | 'upi' | 'card' | 'online',
        stopovers: stopovers.map(s => s.name)
      };
      
      const newRide = await publishRide(rideData);
      navigate(`/publish-confirmation/${newRide.id}`);
    } catch (error) {
      console.error('Error publishing ride:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-teal-800 mb-2">Where are you driving from?</h2>
              <p className="text-gray-600">Select your departure location</p>
            </div>
            
            <div className="relative">
              <Input 
                className="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all"
                placeholder="Enter pickup location" 
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
            </div>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {fromSuggestions.filter(s => 
                  !fromName || s.name.toLowerCase().includes(fromName.toLowerCase())
                ).slice(0, 5).map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => selectFromSuggestion(suggestion)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{suggestion.name}</div>
                        <div className="text-sm text-gray-500">{suggestion.address}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-teal-800 mb-2">Where are you going?</h2>
              <p className="text-gray-600">Select your destination and optional stopovers</p>
            </div>
            
            <div className="relative">
              <Input 
                className="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all"
                placeholder="Enter destination" 
                value={toName}
                onChange={(e) => setToName(e.target.value)}
              />
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            </div>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {toSuggestions.filter(s => 
                  !toName || s.name.toLowerCase().includes(toName.toLowerCase())
                ).slice(0, 5).map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => selectToSuggestion(suggestion)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{suggestion.name}</div>
                        <div className="text-sm text-gray-500">{suggestion.address}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stopovers */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">Add stopovers to get more passengers</h3>
              
              {stopovers.map((stopover) => (
                <div key={stopover.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl mb-3 border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium text-gray-900">{stopover.name}</div>
                      <div className="text-sm text-gray-500">{stopover.address}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStopover(stopover.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Card className="border border-gray-200">
                <CardContent className="p-0">
                  {stopoverSuggestions.slice(0, 3).map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => addStopover(suggestion)}
                    >
                      <div className="flex items-center space-x-3">
                        <Plus className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900">{suggestion.name}</div>
                          <div className="text-sm text-gray-500">{suggestion.address}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <Button 
              onClick={handleNextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full py-4 rounded-xl text-lg font-semibold"
              disabled={!toName}
            >
              Continue
            </Button>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-teal-800 mb-2">When are you going?</h2>
              <p className="text-gray-600">Select your departure date</p>
            </div>
            
            <Card className="border-0 shadow-sm p-6">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                className="mx-auto"
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </Card>
            
            {departureDate && (
              <Button 
                onClick={handleNextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full py-4 rounded-xl text-lg font-semibold"
              >
                Select Time
              </Button>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-teal-800 mb-2">What time will you pick up passengers?</h2>
              <p className="text-gray-600">Choose your departure time</p>
            </div>
            
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-48 h-20 text-4xl font-bold border-2 border-blue-200 hover:border-blue-400 rounded-xl"
                  >
                    {departureTime}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl border-2">
                  <div className="p-4 grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                    {timeOptions.map(time => (
                      <Button 
                        key={time}
                        variant="ghost"
                        onClick={() => setDepartureTime(time)}
                        className={cn(
                          "text-center font-semibold",
                          time === departureTime && "bg-blue-100 text-blue-700"
                        )}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              onClick={handleNextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full py-4 rounded-xl text-lg font-semibold"
            >
              Continue
            </Button>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-teal-800 mb-2">How many passengers can you take?</h2>
              <p className="text-gray-600">Set the number of available seats</p>
            </div>
            
            <div className="flex items-center justify-center space-x-8">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseSeats}
                className="rounded-full border-2 border-blue-500 h-16 w-16 hover:bg-blue-50"
              >
                <Minus className="h-8 w-8 text-blue-500" />
              </Button>
              
              <span className="text-8xl font-bold text-teal-800">{seats}</span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={increaseSeats}
                className="rounded-full border-2 border-blue-500 h-16 w-16 hover:bg-blue-50"
              >
                <Plus className="h-8 w-8 text-blue-500" />
              </Button>
            </div>
            
            <Card className="border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="max-two-back" 
                  checked={maxTwoInBack}
                  onCheckedChange={(checked) => setMaxTwoInBack(checked === true)}
                />
                <div>
                  <Label htmlFor="max-two-back" className="font-semibold">Max. 2 in the back</Label>
                  <p className="text-sm text-gray-600">Keep the middle seat empty for comfort</p>
                </div>
              </div>
            </Card>
            
            <Button 
              onClick={handleNextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full py-4 rounded-xl text-lg font-semibold"
            >
              Continue
            </Button>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-teal-800 mb-2">Tell us about your vehicle and payment</h2>
              <p className="text-gray-600">Add vehicle details, payment method, and set your price</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-make" className="font-semibold">Vehicle Make</Label>
                  <Input
                    id="vehicle-make"
                    placeholder="Toyota, Honda, etc."
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vehicle-model" className="font-semibold">Vehicle Model</Label>
                  <Input
                    id="vehicle-model"
                    placeholder="Corolla, Civic, etc."
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle-color" className="font-semibold">Vehicle Color</Label>
                <Input
                  id="vehicle-color"
                  placeholder="White, Black, Silver, etc."
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-type" className="font-semibold">Payment Method</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="online">Online (Cards/Wallets)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="font-semibold">Price per seat (₹)</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder="500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 pl-8"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</div>
                </div>
              </div>
              
              <Card className="border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="instant-booking"
                    checked={instantBooking}
                    onCheckedChange={(checked) => setInstantBooking(checked === true)}
                  />
                  <div>
                    <Label htmlFor="instant-booking" className="font-semibold">Allow instant booking</Label>
                    <p className="text-sm text-gray-600">Passengers can book without approval</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <Button 
              onClick={handlePublish}
              className="bg-green-500 hover:bg-green-600 text-white w-full py-4 rounded-xl text-lg font-semibold"
              disabled={!vehicleMake || !vehicleModel || !vehicleColor || !price}
            >
              Publish Ride
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isUserVerified) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-800 mb-2">Verification Required</h1>
          <p className="text-gray-600">You need to verify your ID before you can publish rides</p>
        </div>
        
        <Alert className="border-orange-200 bg-orange-50 mb-6">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            For the safety and security of all users, ID verification is required to publish rides. This helps build trust in our community.
          </AlertDescription>
        </Alert>
        
        <IDVerification />
      </div>
    );
  }

  if (currentStep === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-800 mb-2">Publish your ride in minutes</h1>
          <p className="text-gray-600">Start your journey with fellow travelers</p>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <Input 
              className="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all"
              placeholder="Where are you driving from?" 
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              onClick={() => setCurrentStep(0)}
            />
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
          </div>
          
          <div className="relative">
            <Input 
              className="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all"
              placeholder="Where are you going to?" 
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              onClick={() => fromName ? setCurrentStep(1) : alert("Please enter where you're driving from first")}
            />
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
          </div>
          
          <Card className="border-2 border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <span className="text-gray-700 font-medium">{seats} passengers</span>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600 mb-4">
              Save up to ₹1,160 on your first ride.
            </p>
            
            <Button 
              onClick={() => setCurrentStep(0)}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full py-4 rounded-xl text-lg font-semibold"
            >
              Start Publishing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg">
      <div className="p-8">
        {renderStepContent()}
      </div>
    </div>
  );
}
