
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ride } from "@/types";
import PublishedRideCard from "./PublishedRideCard";
import BookedRideCard from "./BookedRideCard";

interface YourRidesListProps {
  publishedRides: Ride[];
  bookedRides: Ride[];
}

export default function YourRidesList({ publishedRides, bookedRides }: YourRidesListProps) {
  const [activeTab, setActiveTab] = useState("booked");

  const renderEmptyState = (type: "booked" | "published") => (
    <div className="py-12 text-center">
      <div className="w-24 h-24 mx-auto mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-gray-300 w-full h-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">No {type} rides yet</h3>
      {type === "booked" ? (
        <>
          <p className="text-gray-500 mb-4">Find the perfect ride from thousands of destinations</p>
          <Link to="/">
            <Button>Search for rides</Button>
          </Link>
        </>
      ) : (
        <>
          <p className="text-gray-500 mb-4">Share your travel costs by publishing a ride</p>
          <Link to="/publish">
            <Button>Publish a ride</Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="booked">Booked rides</TabsTrigger>
          <TabsTrigger value="published">Published rides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="booked">
          {bookedRides.length > 0 ? (
            <div className="space-y-4">
              {bookedRides.map(ride => (
                <BookedRideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            renderEmptyState("booked")
          )}
        </TabsContent>
        
        <TabsContent value="published">
          {publishedRides.length > 0 ? (
            <div className="space-y-4">
              {publishedRides.map(ride => (
                <PublishedRideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            renderEmptyState("published")
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
