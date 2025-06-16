
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useRides } from '@/contexts/RideContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/contexts/MessageContext';
import { Ride, Message } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Phone, Mail, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

const ContactDriver = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rides, bookedRides } = useRides();
  const { user } = useAuth();
  const { messages, sendMessage, refreshMessages } = useMessages();
  const { toast } = useToast();
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [rideMessages, setRideMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Find the ride from both regular rides and booked rides
    const foundRide = rides.find(r => r.id === id) || bookedRides.find(r => r.id === id);
    setRide(foundRide || null);
    
    // Refresh messages when component mounts
    refreshMessages();
  }, [id, rides, bookedRides, refreshMessages]);

  useEffect(() => {
    // Filter messages for this specific ride
    if (ride && user) {
      const filteredMessages = messages.filter(msg => 
        msg.rideId === ride.id &&
        ((msg.sender.id === user.id && msg.recipient.id === ride.driver.id) ||
         (msg.sender.id === ride.driver.id && msg.recipient.id === user.id) ||
         // Include messages with passengers if user is driver
         (user.id === ride.driver.id && ride.passengers?.some(p => p.id === msg.sender.id || p.id === msg.recipient.id)) ||
         // Include messages if user is passenger
         (ride.passengers?.some(p => p.id === user.id) && (msg.sender.id === ride.driver.id || msg.recipient.id === ride.driver.id)))
      );
      
      // Sort messages by timestamp
      const sortedMessages = filteredMessages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setRideMessages(sortedMessages);
    }
  }, [messages, ride, user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !ride || !user) return;
    
    try {
      const isUserDriver = user.id === ride.driver.id;
      const recipientId = isUserDriver ? 
        (ride.passengers && ride.passengers[0] ? ride.passengers[0].id : '') : 
        ride.driver.id;

      if (!recipientId) {
        toast({
          title: "Cannot Send Message",
          description: "No recipient found for this ride.",
          variant: "destructive"
        });
        return;
      }

      await sendMessage(recipientId, message, ride.id);
      setMessage('');
      
      // Refresh messages to get the latest updates
      setTimeout(() => {
        refreshMessages();
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCall = () => {
    if (!ride || !user) return;
    
    const isUserDriver = user.id === ride.driver.id;
    const contactPerson = isUserDriver ? 
      (ride.passengers && ride.passengers[0] ? ride.passengers[0] : null) : 
      ride.driver;

    if (contactPerson?.phone) {
      window.open(`tel:${contactPerson.phone}`);
    } else {
      toast({
        title: "Phone Number Not Available",
        description: "Contact's phone number is not available.",
        variant: "destructive"
      });
    }
  };

  const handleEmail = () => {
    if (!ride || !user) return;
    
    const isUserDriver = user.id === ride.driver.id;
    const contactPerson = isUserDriver ? 
      (ride.passengers && ride.passengers[0] ? ride.passengers[0] : null) : 
      ride.driver;

    if (contactPerson?.email) {
      window.open(`mailto:${contactPerson.email}?subject=${encodeURIComponent(subject || 'Ride Inquiry')}`);
    } else {
      toast({
        title: "Email Not Available",
        description: "Contact's email is not available.",
        variant: "destructive"
      });
    }
  };

  if (!ride) {
    return (
      <Layout>
        <div className="container py-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ride not found</h2>
            <p className="text-gray-600">The ride you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const departureDate = parseISO(ride.departureTime);
  const isUserDriver = user && ride.driver?.id === user.id;
  const contactPerson = isUserDriver ? 
    (ride.passengers && ride.passengers[0] ? ride.passengers[0] : { name: 'Passenger', email: '', phone: '' }) : 
    ride.driver;

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              Contact {isUserDriver ? 'Passenger' : 'Driver'}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ride Information */}
            <Card>
              <CardHeader>
                <CardTitle>Ride Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">{format(departureDate, "EEE, dd MMM yyyy")}</p>
                    <p className="text-sm text-gray-600">
                      {format(parseISO(ride.departureTime), "HH:mm")} - {format(parseISO(ride.arrivalTime), "HH:mm")}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="font-medium">{ride.from.name}</p>
                      <p className="text-sm text-gray-600">{ride.from.address}</p>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex-1">
                      <p className="font-medium">{ride.to.name}</p>
                      <p className="text-sm text-gray-600">{ride.to.address}</p>
                    </div>
                  </div>
                  
                  {ride.vehicle && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium">Vehicle Details</p>
                      <p className="text-sm text-gray-600">
                        {ride.vehicle.make} {ride.vehicle.model} - {ride.vehicle.color}
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <p className="text-lg font-bold text-green-600">₹{ride.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{contactPerson.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{contactPerson.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleCall}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleEmail}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Chat Messages */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-50">
                {rideMessages.length > 0 ? (
                  rideMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender.id === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-800 border'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium opacity-70">
                            {msg.sender.name}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {format(new Date(msg.timestamp), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <Input
                  placeholder="Subject (optional)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ContactDriver;
