
import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  currentPhoto?: string;
  userName?: string;
  onPhotoChange: (photoUrl: string) => void;
}

export function PhotoUpload({ currentPhoto, userName, onPhotoChange }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Create FileReader to convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      
      // Store in localStorage
      localStorage.setItem('rideshare-profile-photo', base64String);
      
      // Call the callback with the new photo URL
      onPhotoChange(base64String);
      
      setIsUploading(false);
      
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo.",
        variant: "destructive",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-6">
      <Avatar className="w-20 h-20 border-4 border-gray-100 dark:border-gray-700">
        {currentPhoto ? (
          <AvatarImage src={currentPhoto} alt="Profile" />
        ) : (
          <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleButtonClick}
          disabled={isUploading}
          className="mt-3"
        >
          <Camera className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Change photo'}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          JPG, PNG or GIF. Max 5MB.
        </p>
      </div>
    </div>
  );
}
