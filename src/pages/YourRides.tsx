
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import YourRidesList from '@/components/features/YourRidesList';
import { useAuth } from '@/contexts/AuthContext';
import { useRides } from '@/contexts/RideContext';
import { Button } from '@/components/ui/button';

const YourRides = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userRides, bookedRides } = useRides();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/your-rides' } });
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your rides</h1>
          <Button onClick={() => navigate('/publish')}>
            Publish a ride
          </Button>
        </div>
        
        <YourRidesList publishedRides={userRides} bookedRides={bookedRides} />
      </div>
    </Layout>
  );
};

export default YourRides;
