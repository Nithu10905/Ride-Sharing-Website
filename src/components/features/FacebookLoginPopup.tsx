
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';

interface FacebookAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface FacebookLoginPopupProps {
  onAccountSelect: (account: FacebookAccount) => void;
  onClose: () => void;
}

const FacebookLoginPopup: React.FC<FacebookLoginPopupProps> = ({ onAccountSelect, onClose }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Mock Facebook accounts with your specified emails
  const accounts: FacebookAccount[] = [
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
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Boyada Rshan Reddy',
      email: 'boyadarshanreddy@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const handleAccountClick = (account: FacebookAccount) => {
    setSelectedAccount(account.id);
    setTimeout(() => {
      onAccountSelect(account);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 bg-white shadow-2xl">
        <CardHeader className="text-center pb-4 relative bg-blue-600 text-white rounded-t-lg">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-white hover:bg-blue-700"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-white rounded mr-2 flex items-center justify-center text-blue-600 font-bold">f</div>
            <span className="text-lg font-medium">Continue to Rideshare</span>
          </div>
          <p className="text-sm text-blue-100">Choose an account to continue</p>
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
                  name: 'New Facebook User',
                  email: 'newfbuser@facebook.com',
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

export default FacebookLoginPopup;
