
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';

interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface GoogleLoginPopupProps {
  onAccountSelect: (account: GoogleAccount) => void;
  onClose: () => void;
}

const GoogleLoginPopup: React.FC<GoogleLoginPopupProps> = ({ onAccountSelect, onClose }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Mock Google accounts with your specified emails
  const accounts: GoogleAccount[] = [
    {
      id: '1',
      name: 'M V S Nitheesh Reddy',
      email: 'mvsnitheeshreddy@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Palluru Mouli',
      email: 'pallurumouli18@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Boyada Rshan Reddy',
      email: 'boyadarshanreddy@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const handleAccountClick = (account: GoogleAccount) => {
    setSelectedAccount(account.id);
    setTimeout(() => {
      onAccountSelect(account);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 bg-white shadow-2xl">
        <CardHeader className="text-center pb-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded mr-2 flex items-center justify-center text-white font-bold">G</div>
            <span className="text-lg font-medium text-gray-700">Sign in</span>
          </div>
          <p className="text-sm text-gray-600">Choose an account</p>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="space-y-1">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedAccount === account.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleAccountClick(account)}
              >
                <Avatar className="w-10 h-10 mr-4">
                  <AvatarImage src={account.avatar} alt={account.name} />
                  <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{account.name}</div>
                  <div className="text-sm text-gray-600">{account.email}</div>
                </div>
                {selectedAccount === account.id && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={() => {
                // Simulate "Use another account" flow
                const newAccount = {
                  id: 'new',
                  name: 'New User',
                  email: 'newuser@gmail.com',
                  avatar: ''
                };
                onAccountSelect(newAccount);
              }}
            >
              Use another account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleLoginPopup;
