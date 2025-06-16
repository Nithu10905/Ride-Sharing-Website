
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, AlertTriangle } from 'lucide-react';

export const DeleteAccount = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    if (!currentPassword) {
      toast({
        title: "Password required",
        description: "Please enter your current password to delete your account.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      // Simulate password verification and account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      });
      
      // Logout user after account deletion
      logout();
      
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "There was an error deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setCurrentPassword('');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-3" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">Warning!</p>
            <p className="text-xs text-red-600 mt-1">
              • All your published rides will be cancelled<br/>
              • Your booking history will be deleted<br/>
              • This action cannot be reversed
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-semibold">
              Enter your current password to confirm
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="border-red-300 focus:border-red-500"
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCurrentPassword('')}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={!currentPassword || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
