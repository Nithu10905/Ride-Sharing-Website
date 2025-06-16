
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useRides } from '@/contexts/RideContext';
import RideCard from '@/components/features/RideCard';
import { Ride } from '@/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Users, Clock, DollarSign, Navigation, Hourglass, Filter, Shield } from 'lucide-react';

type SortOption = 'earliest' | 'lowest' | 'closest-departure' | 'closest-arrival' | 'shortest';

interface FilterOptions {
  sortBy: SortOption;
  timeRange: string[];
  verifiedProfile: boolean;
  instantBooking: boolean;
  smokingAllowed: boolean;
  petsAllowed: boolean;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { searchRides } = useRides();
  const [results, setResults] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'earliest',
    timeRange: [],
    verifiedProfile: false,
    instantBooking: false,
    smokingAllowed: false,
    petsAllowed: false
  });

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const stopovers = searchParams.get('stopovers')?.split(',') || [];
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let rides = await searchRides(from, to);
        
        // Filter by date if provided
        if (date) {
          rides = rides.filter(ride => {
            const rideDate = new Date(ride.departureTime).toISOString().split('T')[0];
            return rideDate === date;
          });
        }
        
        // Filter by available seats
        rides = rides.filter(ride => ride.availableSeats >= passengers);
        
        setResults(rides);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [from, to, date, passengers, searchRides]);
  
  const filteredResults = [...results]
    .filter(ride => {
      // Filter by verified profile - check if driver has verified ID
      if (filterOptions.verifiedProfile) {
        const isVerified = ride.driver.isIDVerified || (ride.driver.email && ride.driver.phone);
        if (!isVerified) return false;
      }
      
      // Filter by instant booking
      if (filterOptions.instantBooking && !ride.instantBooking) {
        return false;
      }
      
      // Filter by smoking allowed
      if (filterOptions.smokingAllowed && !ride.amenities?.smoking) {
        return false;
      }
      
      // Filter by pets allowed
      if (filterOptions.petsAllowed && !ride.amenities?.pets) {
        return false;
      }
      
      // Filter by time range
      if (filterOptions.timeRange.length > 0) {
        const departureHour = new Date(ride.departureTime).getHours();
        
        const inSelectedTimeRange = filterOptions.timeRange.some(range => {
          switch (range) {
            case 'morning':
              return departureHour >= 6 && departureHour < 12;
            case 'afternoon':
              return departureHour >= 12 && departureHour < 18;
            case 'evening':
              return departureHour >= 18 && departureHour < 24;
            case 'night':
              return departureHour >= 0 && departureHour < 6;
            default:
              return false;
          }
        });
        
        if (!inSelectedTimeRange) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'earliest':
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
        case 'lowest':
          return a.price - b.price;
        case 'closest-departure':
          // For demo purposes, assume first results are closer
          return 0;
        case 'closest-arrival':
          // For demo purposes, assume first results are closer
          return 0;
        case 'shortest':
          // Calculate estimated duration and sort by shortest
          const aDuration = new Date(a.arrivalTime).getTime() - new Date(a.departureTime).getTime();
          const bDuration = new Date(b.arrivalTime).getTime() - new Date(b.departureTime).getTime();
          return aDuration - bDuration;
        default:
          return 0;
      }
    });

  const handleSortChange = (value: string) => {
    setFilterOptions(prev => ({ ...prev, sortBy: value as SortOption }));
  };

  const handleTimeRangeChange = (timeRange: string, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      timeRange: checked
        ? [...prev.timeRange, timeRange]
        : prev.timeRange.filter(t => t !== timeRange),
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFilterOptions(prev => ({ ...prev, [id]: checked }));
  };
  
  const clearFilters = () => {
    setFilterOptions({
      sortBy: 'earliest',
      timeRange: [],
      verifiedProfile: false,
      instantBooking: false,
      smokingAllowed: false,
      petsAllowed: false
    });
  };

  // Count rides for each filter category
  const morningRides = results.filter(r => {
    const hour = new Date(r.departureTime).getHours();
    return hour >= 6 && hour < 12;
  }).length;
  
  const afternoonRides = results.filter(r => {
    const hour = new Date(r.departureTime).getHours();
    return hour >= 12 && hour < 18;
  }).length;

  const eveningRides = results.filter(r => {
    const hour = new Date(r.departureTime).getHours();
    return hour >= 18 && hour < 24;
  }).length;

  const nightRides = results.filter(r => {
    const hour = new Date(r.departureTime).getHours();
    return hour >= 0 && hour < 6;
  }).length;
  
  const verifiedRides = results.filter(r => 
    r.driver.isIDVerified || (r.driver.email && r.driver.phone)
  ).length;
  
  const instantBookingRides = results.filter(r => r.instantBooking).length;
  const smokingRides = results.filter(r => r.amenities?.smoking).length;
  const petsRides = results.filter(r => r.amenities?.pets).length;

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        {/* Search Summary */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Search Results</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-gray-500 block">From</span>
                <span className="font-semibold text-gray-900">{from}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <span className="text-gray-500 block">To</span>
                <span className="font-semibold text-gray-900">{to}</span>
              </div>
            </div>
            {date && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <span className="text-gray-500 block">Date</span>
                  <span className="font-semibold text-gray-900">{new Date(date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <span className="text-gray-500 block">Passengers</span>
                <span className="font-semibold text-gray-900">{passengers}</span>
              </div>
            </div>
          </div>
          
          {stopovers.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <span className="text-gray-500 text-sm font-medium">Stopovers:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {stopovers.map((stopover, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                    {stopover}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-bold text-2xl text-gray-900">{filteredResults.length}</span> 
                {filteredResults.length === 1 ? ' ride' : ' rides'} available
              </p>
              {filteredResults.length !== results.length && (
                <p className="text-sm text-gray-500">
                  Filtered from {results.length} total results
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h2 className="font-bold text-lg text-gray-900">Filters</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Clear all
                </Button>
              </div>
              
              {/* Sort by */}
              <div className="mb-8">
                <h3 className="font-semibold text-base mb-4 text-gray-800">Sort by</h3>
                <RadioGroup 
                  value={filterOptions.sortBy}
                  onValueChange={handleSortChange}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="earliest" id="earliest" />
                    <Label htmlFor="earliest" className="text-sm font-medium flex items-center cursor-pointer">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Earliest departure
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="lowest" id="lowest" />
                    <Label htmlFor="lowest" className="text-sm font-medium flex items-center cursor-pointer">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      Lowest price
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="closest-departure" id="closest-departure" />
                    <Label htmlFor="closest-departure" className="text-sm font-medium flex items-center cursor-pointer">
                      <Navigation className="h-4 w-4 mr-2 text-purple-500" />
                      Close to departure
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="closest-arrival" id="closest-arrival" />
                    <Label htmlFor="closest-arrival" className="text-sm font-medium flex items-center cursor-pointer">
                      <Navigation className="h-4 w-4 mr-2 text-purple-500" />
                      Close to arrival
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="shortest" id="shortest" />
                    <Label htmlFor="shortest" className="text-sm font-medium flex items-center cursor-pointer">
                      <Hourglass className="h-4 w-4 mr-2 text-orange-500" />
                      Shortest duration
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Departure time */}
              <div className="mb-8">
                <h3 className="font-semibold text-base mb-4 text-gray-800">Departure time</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="morning" 
                        checked={filterOptions.timeRange.includes('morning')}
                        onCheckedChange={(checked) => {
                          handleTimeRangeChange('morning', checked === true);
                        }}
                      />
                      <Label htmlFor="morning" className="text-sm font-medium cursor-pointer">06:00 - 12:00</Label>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{morningRides}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="afternoon" 
                        checked={filterOptions.timeRange.includes('afternoon')}
                        onCheckedChange={(checked) => {
                          handleTimeRangeChange('afternoon', checked === true);
                        }}
                      />
                      <Label htmlFor="afternoon" className="text-sm font-medium cursor-pointer">12:01 - 18:00</Label>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{afternoonRides}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="evening" 
                        checked={filterOptions.timeRange.includes('evening')}
                        onCheckedChange={(checked) => {
                          handleTimeRangeChange('evening', checked === true);
                        }}
                      />
                      <Label htmlFor="evening" className="text-sm font-medium cursor-pointer">18:01 - 00:00</Label>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{eveningRides}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="night" 
                        checked={filterOptions.timeRange.includes('night')}
                        onCheckedChange={(checked) => {
                          handleTimeRangeChange('night', checked === true);
                        }}
                      />
                      <Label htmlFor="night" className="text-sm font-medium cursor-pointer">00:01 - 06:00</Label>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{nightRides}</span>
                  </div>
                </div>
              </div>
              
              {/* Trust and safety */}
              <div className="mb-8">
                <h3 className="font-semibold text-base mb-4 text-gray-800 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  Trust & Safety
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="verifiedProfile" 
                      checked={filterOptions.verifiedProfile}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange('verifiedProfile', checked === true);
                      }}
                    />
                    <Label htmlFor="verifiedProfile" className="text-sm font-medium cursor-pointer">Verified Drivers Only</Label>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{verifiedRides}</span>
                </div>
              </div>
              
              {/* Amenities */}
              <div className="mb-6">
                <h3 className="font-semibold text-base mb-4 text-gray-800">Amenities</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="instantBooking" 
                        checked={filterOptions.instantBooking}
                        onCheckedChange={(checked) => {
                          handleCheckboxChange('instantBooking', checked === true);
                        }}
                      />
                      <Label htmlFor="instantBooking" className="text-sm font-medium cursor-pointer">Instant Booking</Label>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">{instantBookingRides}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="smokingAllowed" 
                        checked={filterOptions.smokingAllowed}
                        onCheckedChange={(checked) => {
                          handleCheckboxChange('smokingAllowed', checked === true);
                        }}
                      />
                      <Label htmlFor="smokingAllowed" className="text-sm font-medium cursor-pointer">Smoking allowed</Label>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">{smokingRides}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="petsAllowed" 
                        checked={filterOptions.petsAllowed}
                        onCheckedChange={(checked) => {
                          handleCheckboxChange('petsAllowed', checked === true);
                        }}
                      />
                      <Label htmlFor="petsAllowed" className="text-sm font-medium cursor-pointer">Pets allowed</Label>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">{petsRides}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-6">
                {filteredResults.map(ride => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-gray-900">No rides found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any rides matching your search criteria. Try adjusting your filters or search for a different route.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Modify search
                  </Button>
                  <Button onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchResults;
