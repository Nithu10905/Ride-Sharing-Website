import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getLocationRecommendations } from '@/lib/mongodb';

interface SearchBarProps {
  variant?: 'homepage' | 'page';
}

export default function SearchBar({ variant = 'homepage' }: SearchBarProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch suggestions for "from"
  useEffect(() => {
    let active = true;
    if (from.length > 2) {
      getLocationRecommendations(from).then((suggestions) => {
        if (active) setFromSuggestions(suggestions);
      });
    } else {
      setFromSuggestions([]);
    }
    return () => { active = false };
  }, [from]);

  // Fetch suggestions for "to"
  useEffect(() => {
    let active = true;
    if (to.length > 2) {
      getLocationRecommendations(to).then((suggestions) => {
        if (active) setToSuggestions(suggestions);
      });
    } else {
      setToSuggestions([]);
    }
    return () => { active = false };
  }, [to]);

  // Properly close the dropdown when clicking outside or blur
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        fromInputRef.current &&
        !fromInputRef.current.contains(e.target as Node)
      ) {
        setShowFromSuggestions(false);
      }
      if (
        toInputRef.current &&
        !toInputRef.current.contains(e.target as Node)
      ) {
        setShowToSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = () => {
    if (!from.trim() || !to.trim()) {
      alert('Please enter both departure and destination locations');
      return;
    }
    const searchParams = new URLSearchParams({
      from: from.trim(),
      to: to.trim(),
      ...(date && { date: format(date, 'yyyy-MM-dd') }),
      passengers: passengers.toString(),
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFrom(suggestion);
      setShowFromSuggestions(false);
      // Optionally move focus to next field
      toInputRef.current?.focus();
    } else {
      setTo(suggestion);
      setShowToSuggestions(false);
    }
  };

  const incrementPassengers = () => {
    if (passengers < 8) setPassengers(passengers + 1);
  };

  const decrementPassengers = () => {
    if (passengers > 1) setPassengers(passengers - 1);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const containerClass =
    variant === 'homepage'
      ? "relative z-10 w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-full shadow-2xl p-2 flex items-center border border-gray-200 dark:border-gray-700 min-h-[70px] mt-4 transition-all duration-300"
      : "relative bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-4";

  return (
    <div className={containerClass}>
      <div className="flex w-full items-center gap-0 flex-wrap">
        {/* From Location */}
        <div className="flex-1 min-w-[200px] relative z-20">
          <div className="flex items-center bg-transparent rounded-full h-[60px] px-4 border-r border-gray-200 dark:border-gray-600 transition-all duration-200">
            <MapPin className="mr-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Leaving from
              </label>
              <input
                ref={fromInputRef}
                placeholder="City, airport, address..."
                value={from}
                onChange={e => {
                  setFrom(e.target.value);
                  setShowFromSuggestions(true);
                }}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 160)}
                className="w-full text-base font-medium bg-transparent outline-none border-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                autoComplete="off"
              />
            </div>
          </div>
          {showFromSuggestions && fromSuggestions.length > 0 && (
            <div className="absolute mt-2 left-0 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-50 animate-fade-in">
              {fromSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0 text-base font-medium flex items-center space-x-2"
                  tabIndex={-1}
                  onClick={() => handleSuggestionClick(suggestion, 'from')}
                >
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-900 dark:text-gray-100">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* To Location */}
        <div className="flex-1 min-w-[200px] relative z-20">
          <div className="flex items-center bg-transparent rounded-full h-[60px] px-4 border-r border-gray-200 dark:border-gray-600 transition-all duration-200">
            <MapPin className="mr-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Going to
              </label>
              <input
                ref={toInputRef}
                placeholder="City, airport, address..."
                value={to}
                onChange={e => {
                  setTo(e.target.value);
                  setShowToSuggestions(true);
                }}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 160)}
                className="w-full text-base font-medium bg-transparent outline-none border-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                autoComplete="off"
              />
            </div>
          </div>
          {showToSuggestions && toSuggestions.length > 0 && (
            <div className="absolute mt-2 left-0 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-50 animate-fade-in">
              {toSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0 text-base font-medium flex items-center space-x-2"
                  tabIndex={-1}
                  onClick={() => handleSuggestionClick(suggestion, 'to')}
                >
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-900 dark:text-gray-100">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="flex-1 min-w-[140px] max-w-[170px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-[60px] justify-start text-left font-medium border-none hover:bg-transparent focus:ring-0 rounded-full text-gray-700 dark:text-gray-300 px-4 border-r border-gray-200 dark:border-gray-600"
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <div className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Departure
                  </div>
                  <div className="text-base font-medium">
                    {date ? format(date, "dd/MM/yyyy") : "Today"}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < today}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passengers */}
        <div className="flex-1 min-w-[140px] max-w-[170px]">
          <div className="flex items-center justify-between h-[60px] px-4 gap-1">
            <div className="flex items-center flex-1">
              <Users className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <div>
                <div className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Passengers
                </div>
                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {passengers} passenger{passengers > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={decrementPassengers}
                disabled={passengers <= 1}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-lg font-bold text-gray-600 dark:text-gray-400"
                type="button"
                tabIndex={-1}
              >
                -
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={incrementPassengers}
                disabled={passengers >= 8}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-lg font-bold text-gray-600 dark:text-gray-400"
                type="button"
                tabIndex={-1}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex-shrink-0 pl-4">
          <Button 
            onClick={handleSearch}
            className="h-14 px-8 bg-[#246df2] hover:bg-[#2769dc] transition-all duration-200 shadow-lg font-semibold text-base rounded-full flex items-center gap-2 text-white"
          >
            <Search className="w-5 h-5" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
