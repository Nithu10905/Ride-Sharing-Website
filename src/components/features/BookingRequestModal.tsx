
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Ride, User } from '@/types';

interface BookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
  user: User;
  onSubmit: (message: string) => Promise<void>;
}

export default function BookingRequestModal({ 
  isOpen, 
  onClose, 
  ride, 
  user, 
  onSubmit 
}: BookingRequestModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(message);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error submitting booking request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request to Book Ride</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              This ride requires driver approval. Your request will be sent to {ride.driver.name}.
            </p>
          </div>
          
          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Message to driver (optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Hi! I'd like to book a seat on your ride. I'm a reliable passenger..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          
          <div className="pt-4 space-y-3">
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Sending Request...' : 'Send Booking Request'}
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
