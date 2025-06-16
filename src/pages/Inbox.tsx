
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MessageList from '@/components/features/MessageList';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/contexts/MessageContext';

const Inbox = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { messages } = useMessages();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/inbox' } });
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  const userMessages = messages.filter(
    message => message.sender.id === user.id || message.recipient.id === user.id
  );
  
  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">Inbox</h1>
        
        <MessageList messages={userMessages} currentUserId={user.id} />
      </div>
    </Layout>
  );
};

export default Inbox;
