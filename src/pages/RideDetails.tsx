
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import RideDetailCard from '@/components/features/RideDetailCard';
import { useRides } from '@/contexts/RideContext';
import { Ride } from '@/types';

const RideDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { rides } = useRides();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch this from MongoDB
    const fetchRide = async () => {
      setLoading(true);
      try {
        // Find the ride in our local context for now
        const foundRide = rides.find(r => r.id === id);
        setRide(foundRide || null);
      } catch (error) {
        console.error('Error fetching ride details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRide();
  }, [id, rides]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!ride) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ride not found</h2>
            <p className="text-gray-600 mb-4">
              The ride you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <RideDetailCard ride={ride} />
        </div>
      </div>
    </Layout>
  );
};

export default RideDetails;
