import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Message, User } from '../types';
import { mockMessages } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface MessageContextType {
  messages: Message[];
  sendMessage: (recipientId: string, content: string, rideId?: string) => Promise<Message>;
  getConversations: (userId: string) => Message[];
  sendSystemMessage: (recipientId: string, content: string, rideId?: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8080/api';

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load messages from backend on mount and set up polling for real-time updates
  useEffect(() => {
    if (user?.id) {
      refreshMessages();
      
      // Set up polling for real-time updates every 3 seconds
      const interval = setInterval(() => {
        refreshMessages();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const refreshMessages = async () => {
    if (!user?.id) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/user/${user.id}`);
      const backendMessages = response.data.map((msg: any) => ({
        id: msg._id,
        sender: {
          id: msg.sender._id,
          name: msg.sender.name,
          email: msg.sender.email
        },
        recipient: {
          id: msg.recipient._id,
          name: msg.recipient.name,
          email: msg.recipient.email
        },
        content: msg.content,
        timestamp: msg.createdAt,
        rideId: msg.rideId,
        read: msg.read
      }));
      
      // Merge with mock messages and remove duplicates
      const allMessages = [...mockMessages, ...backendMessages];
      const uniqueMessages = allMessages.filter((msg, index, self) => 
        index === self.findIndex(m => m.id === msg.id)
      );
      
      setMessages(uniqueMessages);
    } catch (error) {
      console.error('Error loading messages from backend:', error);
      // Keep using mock messages if backend fails
    }
  };

  const sendMessage = async (recipientId: string, content: string, rideId?: string): Promise<Message> => {
    try {
      // Mock sender (current user)
      const sender: User = user || {
        id: "0",
        name: "Current User",
        email: "user@example.com"
      };
      
      // Try to send via backend first
      try {
        const response = await axios.post(`${API_BASE_URL}/messages`, {
          sender: sender.id,
          recipient: recipientId,
          content,
          rideId
        });
        
        const backendMessage: Message = {
          id: response.data._id,
          sender,
          recipient: {
            id: response.data.recipient._id,
            name: response.data.recipient.name,
            email: response.data.recipient.email
          },
          content: response.data.content,
          timestamp: response.data.createdAt,
          rideId: response.data.rideId,
          read: response.data.read
        };
        
        // Update local state immediately for better UX
        setMessages(prevMessages => [...prevMessages, backendMessage]);
        
        // Refresh messages to ensure sync
        setTimeout(() => {
          refreshMessages();
        }, 500);
        
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
        });
        
        return backendMessage;
      } catch (backendError) {
        console.error("Backend message send failed, creating local message:", backendError);
        
        // Create local message as fallback
        const localMessage: Message = {
          id: `local-${Date.now()}`,
          sender,
          recipient: {
            id: recipientId,
            name: "Recipient",
            email: "recipient@example.com"
          },
          content,
          timestamp: new Date().toISOString(),
          rideId,
          read: false
        };
        
        setMessages(prevMessages => [...prevMessages, localMessage]);
        
        toast({
          title: "Message sent locally",
          description: "Your message has been sent (offline mode).",
        });
        
        return localMessage;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
      throw new Error("Failed to send message");
    }
  };

  const sendSystemMessage = async (recipientId: string, content: string, rideId?: string): Promise<void> => {
    try {
      // Create system message locally
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        sender: {
          id: "system",
          name: "RideShare System",
          email: "system@rideshare.com"
        },
        recipient: {
          id: recipientId,
          name: "User",
          email: "user@example.com"
        },
        content,
        timestamp: new Date().toISOString(),
        rideId,
        read: false
      };
      
      setMessages(prevMessages => [...prevMessages, systemMessage]);
      
      // Try to send via backend
      try {
        await axios.post(`${API_BASE_URL}/messages`, {
          sender: "system",
          recipient: recipientId,
          content,
          rideId
        });
        
        // Refresh messages after sending
        setTimeout(() => {
          refreshMessages();
        }, 500);
      } catch (backendError) {
        console.error("Backend system message failed:", backendError);
      }
    } catch (error) {
      console.error("Error sending system message:", error);
    }
  };

  const getConversations = (userId: string): Message[] => {
    return messages.filter(
      message => message.sender.id === userId || message.recipient.id === userId
    );
  };

  return (
    <MessageContext.Provider value={{ 
      messages, 
      sendMessage, 
      getConversations, 
      sendSystemMessage, 
      refreshMessages 
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
