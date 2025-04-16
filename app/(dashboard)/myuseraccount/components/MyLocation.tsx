"use client";

import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { getLocationData } from "@/lib/db/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils"; // Import your currency formatter
import { AlertTriangle, Loader2 } from 'lucide-react'; // Icons for states

// Define the shape of a location object returned getLoctionData
interface LocationData {
    location_id: string;
    description: string;
    doors: Record<string, any>; // jsonb maps well to an object/dictionary
    npc: string | null;          // Can be text or null
    image_link: string | null;   // Can be text or null
}

// Define props for the component, including the location_id to fetch
interface LocationDisplayProps {
    locationId: string; // Use camelCase for prop names convention
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ locationId }) => {
    // State to hold the fetched location data
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    // State to track loading status
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // State to hold any potential errors during fetching
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Define an async function inside useEffect to call the API
        const fetchData = async () => {
            // Ensure we have a valid locationId before fetching
            if (!locationId) {
                setLocationData(null);
                setIsLoading(false);
                setError("No Location ID provided.");
                return;
            }

            setIsLoading(true); // Set loading true before fetching
            setError(null); // Clear previous errors

            try {
                // Call your async function
                const data = await getLocationData(locationId);

                // Your function returns result[0], which might be undefined if no record found
                if (data) {
                    setLocationData({
                        ...data,
                        // Tell TypeScript to treat doors as Record<string, any>
                        doors: data.doors as Record<string, any>
                    });
                } else {
                    setLocationData(null); // Explicitly set to null if no data found
                    // Optionally set an error or a specific 'not found' state
                    // setError(`Location with ID "${locationId}" not found.`);
                }
            } catch (err) {
                console.error("Failed to fetch location data:", err);
                // Set error state to display an error message
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
                setLocationData(null); // Clear data on error
            } finally {
                // Always set loading to false after fetch attempt (success or failure)
                setIsLoading(false);
            }
        };

        fetchData(); // Execute the fetch function

        // Dependency array: re-run the effect if locationId changes
    }, [locationId]);
// --- Determine cardContent based on state ---
let cardContent: React.ReactNode;

if (isLoading) {
    // 1. Loading State
    cardContent = (
        <div className="flex justify-center items-center p-6">
            {/* You can add a spinner component here */}
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading location...</p>
        </div>
    );
} else if (error) {
    // 2. Error State
    cardContent = (
        <div className="flex justify-center items-center p-6 text-red-600 dark:text-red-500">
            <p>Error: {error}</p>
        </div>
    );
} else if (!locationData) {
    // 3. Not Found State (Data is null after loading without error)
    cardContent = (
        <div className="flex justify-center items-center p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Location "{locationId}" not found.
            </p>
        </div>
    );
} else {
    // 4. Success State (Data loaded) - Render the location details
    cardContent = (
        <div className="space-y-4"> {/* Main container for spacing */}

            {/* Image Section (similar to purchases) */}
            {locationData.image_link && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <Image
                        src={locationData.image_link}
                        alt={`Image for ${locationData.description || locationData.location_id}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        // Adjust sizes based on your Card's expected width in the layout
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority // Consider adding priority if it's LCP (Largest Contentful Paint)
                    />
                </div>
            )}

            {/* Description Section */}
            <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Description</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {locationData.description}
                </p>
            </div>
        </div>
    );
}

// --- Final Render using Card components ---
return (
    <Card>
        <CardHeader>
            {/* Use optional chaining in case locationData is null during initial render/error */}
            <CardTitle>Location: {locationData?.location_id || locationId}</CardTitle>
             {/* You could add a subtitle or other info here */}
             {/* Example: <CardDescription>{locationData?.description.substring(0,50)}...</CardDescription> */}
        </CardHeader>
        <CardContent>
            {/* Render the determined content */}
            {cardContent}
        </CardContent>
        {/* Optionally add CardFooter for actions related to the location */}
        {/* <CardFooter> <Button>Interact</Button> </CardFooter> */}
    </Card>
);
};

export default LocationDisplay;