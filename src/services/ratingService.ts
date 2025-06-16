
import { Rating } from '@/types';

class RatingService {
  private baseUrl = '/api/ratings';

  async submitRating(data: {
    raterId: string;
    rateeId: string;
    rideId: string;
    rating: number;
    comment?: string;
    type: 'driver' | 'passenger';
  }): Promise<Rating> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('rideshare_token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch ratings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return [];
    }
  }

  async getRatingsByRide(rideId: string): Promise<Rating[]> {
    try {
      const response = await fetch(`${this.baseUrl}/ride/${rideId}`);
      if (!response.ok) throw new Error('Failed to fetch ride ratings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching ride ratings:', error);
      return [];
    }
  }
}

export const ratingService = new RatingService();
