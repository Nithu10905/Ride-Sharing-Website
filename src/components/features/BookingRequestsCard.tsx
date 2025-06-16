
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, User, Mail, Phone } from 'lucide-react';
import { BookingRequest } from '@/types';
import { useRides } from '@/contexts/RideContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BookingRequestsCardProps {
  rideId: string;
  requests: BookingRequest[];
}

export default function BookingRequestsCard({ rideId, requests }: BookingRequestsCardProps) {
  const { handleBookingRequest } = useRides();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  const handleRequest = async (requestId: string, action: 'accept' | 'decline') => {
    setLoading(requestId);
    try {
      const success = await handleBookingRequest(rideId, requestId, action);
      if (success) {
        toast({
          title: `Request ${action}ed`,
          description: `Booking request has been ${action}ed successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} the request. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  if (!requests || requests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Booking Requests</span>
          {pendingRequests.length > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {pendingRequests.length} pending
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-500" />
              Pending Requests
            </h4>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 bg-orange-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {request.passenger.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{request.passenger.name}</div>
                        <div className="text-sm text-gray-600 flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span>{request.passenger.email}</span>
                        </div>
                        {request.passenger.phone && (
                          <div className="text-sm text-gray-600 flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{request.passenger.phone}</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          Requested: {format(new Date(request.requestTime), 'MMM dd, HH:mm')}
                        </div>
                        {request.message && (
                          <div className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border">
                            {request.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleRequest(request.id, 'accept')}
                        disabled={loading === request.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequest(request.id, 'decline')}
                        disabled={loading === request.id}
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">Recent Decisions</h4>
            <div className="space-y-2">
              {processedRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {request.passenger.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{request.passenger.name}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(request.requestTime), 'MMM dd, HH:mm')}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={request.status === 'accepted' ? 'default' : 'secondary'}
                      className={request.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    >
                      {request.status === 'accepted' ? 'Accepted' : 'Declined'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
