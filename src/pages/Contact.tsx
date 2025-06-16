import Layout from '@/components/layout/Layout';
import ChatBotToggle from '@/components/features/ChatBotToggle';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Award } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - In real app, this would send to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickContact = (type: string) => {
    switch (type) {
      case 'call':
        window.open('tel:+15551234567');
        toast({
          title: "Opening Phone",
          description: "Calling +1 (555) 123-4567",
        });
        break;
      case 'email':
        window.open('mailto:support@rideshare.example');
        toast({
          title: "Opening Email",
          description: "Opening your default email client",
        });
        break;
      case 'chat':
        setIsChatOpen(true);
        toast({
          title: "AI Chat Opened!",
          description: "Our AI assistant is ready to help you!",
        });
        break;
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              We're here to help you with any questions about RideShare. 
              Reach out to us and we'll respond as soon as possible.
            </p>
            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg inline-block">
              <div className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-6 h-6" />
                <span>New: AI Chat Assistant Available 24/7!</span>
              </div>
              <p className="text-sm opacity-80 mt-1">Get instant answers to your questions</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 -mt-8">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" 
                  onClick={() => handleQuickContact('call')}>
              <CardContent className="pt-6">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <p className="text-gray-600">Speak directly with our support team</p>
                <p className="text-primary font-medium mt-2">+1 (555) 123-4567</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleQuickContact('email')}>
              <CardContent className="pt-6">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <p className="text-gray-600">Send us an email anytime</p>
                <p className="text-primary font-medium mt-2">support@rideshare.example</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50"
                  onClick={() => handleQuickContact('chat')}>
              <CardContent className="pt-6">
                <div className="relative">
                  <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Chat Assistant</h3>
                <p className="text-gray-600">Get instant help from our advanced AI</p>
                <p className="text-primary font-medium mt-2">Available 24/7</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Send className="w-6 h-6" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="transition-colors focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                          className="transition-colors focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="transition-colors focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select 
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="billing">Billing Question</option>
                          <option value="feature">Feature Request</option>
                          <option value="bug">Bug Report</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                        className="transition-colors focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Please describe your question or concern in detail..."
                        className="min-h-[150px] transition-colors focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 transform hover:scale-[1.02]" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Information & Stats */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Find us through these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    variant="ghost"
                    onClick={() => handleQuickContact('call')}
                    className="w-full justify-start p-0 h-auto"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                        <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM EST</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => handleQuickContact('email')}
                    className="w-full justify-start p-0 h-auto"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-sm text-gray-600">support@rideshare.example</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>
                  </Button>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Office Address</h3>
                      <p className="text-sm text-gray-600">
                        123 Rideshare Street<br />
                        San Francisco, CA 94103<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-sm text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Why Choose RideShare?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-lg">50K+ Users</p>
                      <p className="text-sm text-gray-600">Active community</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Award className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-lg">4.8/5 Rating</p>
                      <p className="text-sm text-gray-600">Customer satisfaction</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-lg">24/7 AI Support</p>
                      <p className="text-sm text-gray-600">Always here to help</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How do I publish a ride?</h4>
                      <p className="text-sm text-gray-600">Simply click "Publish a ride" in the navigation, fill in your trip details, and publish!</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Is RideShare safe?</h4>
                      <p className="text-sm text-gray-600">Yes! We verify all users and have a comprehensive rating system for safety.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How do payments work?</h4>
                      <p className="text-sm text-gray-600">Secure payments are handled through our platform with multiple payment options.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Can I cancel a booking?</h4>
                      <p className="text-sm text-gray-600">Yes, you can cancel according to our cancellation policy outlined in your booking.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Chat Bot */}
      <ChatBotToggle 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </Layout>
  );
};

export default Contact;
