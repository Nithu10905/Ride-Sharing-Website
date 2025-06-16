
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  helpful?: boolean;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm RideShare Assistant, your intelligent support companion. I'm here to help you with any questions about our platform, from booking rides to troubleshooting issues. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Advanced AI response system
  const getAIResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses based on keywords and intent
    const responses = {
      // Greeting and general
      greeting: [
        "Hello! I'm here to help you with all your RideShare needs. What would you like to know?",
        "Hi there! Welcome to RideShare support. How can I make your experience better today?",
        "Great to see you! I'm your personal RideShare assistant. What can I help you with?"
      ],
      
      // Booking related
      booking: [
        "I'd be happy to help you with booking! Here's what you need to know:\n\n1. Search for rides using our search bar\n2. Select your preferred ride based on time, price, and driver rating\n3. Click 'Book Now' and confirm your details\n4. You'll receive a confirmation with driver contact info\n\nIs there a specific part of the booking process you'd like help with?"
      ],
      
      // Publishing rides
      publish: [
        "Publishing a ride is easy! Here's the step-by-step process:\n\n1. Click 'Publish a Ride' in the navigation\n2. Enter your departure and destination locations\n3. Set your departure date and time\n4. Add number of available seats and price per seat\n5. Include any additional details or requirements\n6. Review and publish!\n\nWould you like me to guide you through any specific step?"
      ],
      
      // Safety concerns
      safety: [
        "Safety is our top priority at RideShare. Here are our safety measures:\n\n✓ All users undergo ID verification\n✓ Comprehensive rating system for drivers and passengers\n✓ 24/7 customer support\n✓ Insurance coverage for all rides\n✓ Real-time ride tracking\n✓ Emergency contact features\n\nDo you have specific safety concerns I can address?"
      ],
      
      // Payment issues
      payment: [
        "I can help with payment-related questions:\n\n• We accept all major credit cards, PayPal, and digital wallets\n• Payments are processed securely through our platform\n• Automatic receipts are sent via email\n• Refunds are processed within 3-5 business days\n• Split payment options available for groups\n\nWhat specific payment issue are you experiencing?"
      ],
      
      // Cancellation policy
      cancellation: [
        "Here's our cancellation policy:\n\n• Free cancellation up to 24 hours before departure\n• 50% refund for cancellations 2-24 hours before\n• No refund for cancellations within 2 hours\n• Emergency cancellations are reviewed case-by-case\n• Drivers can cancel with appropriate notice\n\nNeed help with a specific cancellation?"
      ],
      
      // Technical issues
      technical: [
        "I'm here to help with technical issues:\n\n• Try refreshing the page or restarting the app\n• Clear your browser cache and cookies\n• Ensure you have a stable internet connection\n• Update to the latest version if using mobile\n• Check if the issue persists in incognito/private mode\n\nIf the problem continues, I can escalate this to our technical team. What specific issue are you experiencing?"
      ],
      
      // Account issues
      account: [
        "For account-related help:\n\n• Password reset: Use 'Forgot Password' on login page\n• Profile updates: Go to Profile → Edit Information\n• Email changes: Contact support for verification\n• Account verification: Check your email for verification links\n• Deactivation: Available in Account Settings\n\nWhat account issue can I help you with today?"
      ],
      
      // Pricing questions
      pricing: [
        "Our pricing is transparent and fair:\n\n• Drivers set their own prices per seat\n• No hidden fees or surge pricing\n• Service fee of 10% on each booking\n• Group discounts available for 3+ passengers\n• Prices vary by distance and demand\n• Payment protection for all transactions\n\nLooking for information about a specific route?"
      ]
    };

    // Intent detection based on keywords
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    
    if (message.includes('book') || message.includes('reserve') || message.includes('how to book')) {
      return responses.booking[0];
    }
    
    if (message.includes('publish') || message.includes('create ride') || message.includes('offer ride')) {
      return responses.publish[0];
    }
    
    if (message.includes('safe') || message.includes('security') || message.includes('trust')) {
      return responses.safety[0];
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('refund') || message.includes('money')) {
      return responses.payment[0];
    }
    
    if (message.includes('cancel') || message.includes('refund policy')) {
      return responses.cancellation[0];
    }
    
    if (message.includes('bug') || message.includes('error') || message.includes('not working') || message.includes('problem') || message.includes('issue')) {
      return responses.technical[0];
    }
    
    if (message.includes('account') || message.includes('profile') || message.includes('login') || message.includes('password')) {
      return responses.account[0];
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('fee') || message.includes('expensive')) {
      return responses.pricing[0];
    }

    // Fallback response with helpful suggestions
    return `I understand you're asking about "${userMessage}". While I'm processing your specific question, here are some quick actions I can help with:

• 🚗 **Booking a ride** - Search and reserve your seat
• 📝 **Publishing a ride** - Offer seats to other travelers  
• 🛡️ **Safety information** - Learn about our security measures
• 💳 **Payment help** - Resolve billing questions
• ❌ **Cancellations** - Understand our policies
• 🔧 **Technical support** - Fix app or website issues

Could you please rephrase your question or choose one of these topics? I'm here to provide detailed, personalized assistance!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking time for more natural interaction
    setTimeout(async () => {
      const response = await getAIResponse(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const markHelpful = (messageId: string, helpful: boolean) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    );
    
    toast({
      title: helpful ? "Thanks for your feedback!" : "Feedback received",
      description: helpful ? "I'm glad I could help!" : "I'll work on improving my responses.",
    });
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        content: "Chat reset! I'm here to help you again. What can I assist you with?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    toast({
      title: "Chat Reset",
      description: "Starting fresh! How can I help you today?",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onToggle}
      />
      
      {/* Chat Window */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className={`w-full max-w-md mx-auto shadow-2xl border-2 border-primary/20 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[80vh] max-h-[600px]'}`}>
          <CardHeader className="pb-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="w-6 h-6" />
                RideShare Assistant
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetChat}
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {!isMinimized && (
              <p className="text-white/90 text-sm">
                Advanced AI • Always Available • Instant Responses
              </p>
            )}
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-full">
              <ScrollArea className="flex-1 p-4" style={{ height: 'calc(80vh - 200px)', maxHeight: '400px' }}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : ''}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.sender === 'user'
                              ? 'bg-primary text-white ml-auto'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                          {message.sender === 'bot' && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markHelpful(message.id, true)}
                                className={`p-1 h-6 w-6 ${message.helpful === true ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markHelpful(message.id, false)}
                                className={`p-1 h-6 w-6 ${message.helpful === false ? 'text-red-600' : 'text-gray-400'}`}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question here..."
                    className="flex-1 rounded-full border-2 focus:border-primary"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="rounded-full px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI-powered support • Available 24/7 • Session ID: {sessionId}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default ChatBot;
