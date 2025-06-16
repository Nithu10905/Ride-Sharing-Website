
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export const IDVerification = () => {
  const { user, updateUserProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isVerified = user?.isIDVerified || false;

  const handleVerifyID = async () => {
    if (!idType || !idNumber) {
      toast({
        title: "Missing information",
        description: "Please select ID type and enter ID number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user profile with verification status
      await updateUserProfile({ isIDVerified: true });
      
      setIsOpen(false);
      setIdType('');
      setIdNumber('');
      
      toast({
        title: "ID verified",
        description: "Your ID has been successfully verified and saved!",
      });
    } catch (error) {
      console.error('ID verification failed:', error);
      toast({
        title: "Verification failed",
        description: "Failed to verify ID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">ID</span>
        </div>
        <span className="text-green-600 text-sm font-semibold">Verified</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        <span className="font-medium text-orange-800">ID</span>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Verify now
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify ID</DialogTitle>
            <DialogDescription>
              Please provide your government-issued ID for verification
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id-type">ID Type</Label>
              <Select value={idType} onValueChange={setIdType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driving-license">Driving License</SelectItem>
                  <SelectItem value="voter-id">Voter ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="id-number">ID Number</Label>
              <Input
                id="id-number"
                placeholder="Enter your ID number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> We use bank-level security to protect your information. Your ID will only be used for verification purposes.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleVerifyID}
                className="flex-1"
                disabled={!idType || !idNumber || isLoading}
              >
                {isLoading ? "Verifying..." : "Verify ID"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
