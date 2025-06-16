
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChangePassword } from '@/components/features/ChangePassword';
import { PhoneVerification } from '@/components/features/PhoneVerification';
import { IDVerification } from '@/components/features/IDVerification';
import { NotificationPreferences } from '@/components/features/NotificationPreferences';
import { DeleteAccount } from '@/components/features/DeleteAccount';
import { PhotoUpload } from '@/components/features/PhotoUpload';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Camera, 
  Shield, 
  CheckCircle
} from 'lucide-react';
import OTPVerification from '@/components/features/OTPVerification';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
      setIsPhoneVerified(!!user.isPhoneVerified);
    }

    // Load profile photo from localStorage
    const savedPhoto = localStorage.getItem('rideshare-profile-photo');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [isAuthenticated, navigate, user]);
  
  // Check if user is fully verified (email, phone, and ID)
  const isFullyVerified = user?.email && isPhoneVerified && user?.isIDVerified;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUserProfile(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handlePhotoChange = (photoUrl: string) => {
    setProfilePhoto(photoUrl);
  };

  const handlePhoneVerify = () => {
    if (!formData.phone) {
      toast({
        title: "Phone Required",
        description: "Please add a phone number first",
        variant: "destructive",
      });
      return;
    }
    setShowPhoneVerification(true);
  };

  const handlePhoneVerificationSuccess = async (): Promise<boolean> => {
    try {
      setIsPhoneVerified(true);
      setShowPhoneVerification(false);
      
      // Update the verification status in the backend
      await updateUserProfile({ ...formData, isPhoneVerified: true });
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating phone verification:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to update phone verification status",
        variant: "destructive",
      });
      return false;
    }
  };
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Profile Photo Section */}
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <PhotoUpload
                    currentPhoto={profilePhoto}
                    userName={user.name}
                    onPhotoChange={handlePhotoChange}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{user.name || 'User'}</h3>
                      {isFullyVerified && (
                        <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
                  </div>
                  
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : null}
                </div>
                
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="h-12 border-2 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      disabled={true}
                      className="h-12 border-2 bg-gray-50 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+91 XXXXX XXXXX"
                      className="h-12 border-2 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</Label>
                    <Input 
                      id="address"
                      value={formData.address} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Your current address"
                      className="h-12 border-2 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">About Me</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell others a bit about yourself..."
                    className="min-h-[120px] border-2 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-500">
                    This helps other members get to know you. Tell them about your interests, travel preferences, etc.
                  </p>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        if (user) {
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            address: user.address || '',
                            bio: user.bio || ''
                          });
                        }
                      }}
                      className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          
          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Account Settings */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
                  <Shield className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ChangePassword />
                <NotificationPreferences />
                <DeleteAccount />
              </CardContent>
            </Card>
            
            {/* Verification Status */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Email</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300">Verified</Badge>
                </div>
              
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  isPhoneVerified 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`w-5 h-5 ${isPhoneVerified ? 'text-green-600' : 'text-orange-500'}`} />
                    <span className={`font-medium ${isPhoneVerified ? 'text-green-800' : 'text-orange-800'}`}>
                      Phone Number
                    </span>
                  </div>
                  {isPhoneVerified ? (
                    <Badge className="bg-green-100 text-green-700 border-green-300">Verified</Badge>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={handlePhoneVerify}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 transform hover:scale-105"
                    >
                      Verify Phone
                    </Button>
                  )}
                </div>
                
                <IDVerification />
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Why verify?</strong> Verified accounts build trust and get more ride requests.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Phone Verification Modal */}
      {showPhoneVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <OTPVerification
              email={formData.phone}
              title="Verify Phone Number"
              subtitle={`Enter the OTP sent to ${formData.phone}`}
              type="phone"
              onVerificationSuccess={handlePhoneVerificationSuccess}
              onBack={() => setShowPhoneVerification(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
