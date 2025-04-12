import { db } from '@/lib/db/drizzle'
import { game_locations } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
export default async function purchaselist() {

    // Define the shape of a location object returned getLoctionData
    interface location {
        location_id: string;
        description: string;
        doors: Record<string, any>; // jsonb maps well to an object/dictionary
        npc: string | null;          // Can be text or null
        image_link: string | null;   // Can be text or null
    }

    const allLocations = await db
        .select()
        .from(game_locations);
    //.orderBy(desc(userPurchasesTable.purchaseDate));

    return (
        <section className="flex-1 p-4 lg:p-8">
            <Card className="mb-8">
                <CardHeader>
                    {/* You can add a general title here if needed */}
                </CardHeader>
                <CardContent> {/* Relies on CardContent padding */}
                    <div className="w-full"> {/* Container for the list */}
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Game Locations
                        </h3>
                        {/* Container for all rows with dividers */}
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
                            {allLocations.map((location) => (
                                <div
                                    key={location.location_id}
                                    // Each row is a flex container for the two columns
                                    // Using items-start for top alignment
                                    className="flex flex-row items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    {/* --- Column 1: Location ID & Description --- */}
                                    {/* Adjust width as needed (e.g., w-1/2, flex-1) */}
                                    <div className="w-2/5 pr-2"> {/* Example: Takes 2/3rds width */}
                                        {/* Location ID */}
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {location.location_id}
                                        </h3>
                                        {/* Description Below */}
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                            {location.description}
                                        </p>

                                        {location.npc ? (
                                            <div className="pt-8">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                    NPC A.I. Prompt
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                    {location.npc}
                                                </p>  
                                            </div>                                              
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                
                                            </p>
                                        )}

                                    </div>

                                    {/* --- Column 2: Image & Doors JSON --- */}
                                    {/* Adjust width as needed (e.g., w-1/2, w-1/3) */}
                                    {/* Uses flex-col to stack image above JSON */}
                                    <div className="w-3/5 pl-2 flex flex-col space-y-4"> {/* Example: Takes 1/3rd width, stacks children vertically */}

                                        {/* --- Image Area (Top of Column 2) --- */}
                                        <div className="flex justify-start items-start w-full"> {/* Container for image/placeholder */}
                                            {location.image_link ? (
                                                // Image Container: Adjusted max-width if needed, keep aspect ratio
                                                <div className="relative w-full aspect-video flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                                    {/* Keep your Next.js Image settings */}
                                                    <a href={location.image_link} target="_blank" rel="noopener noreferrer" title="View full image">
                                                        <Image
                                                            src={location.image_link}
                                                            alt={`Image for ${location.location_id}`}
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                            sizes="(max-width: 768px) 30vw, (max-width: 1024px) 25vw, 50vw" // Adjust sizes based on your column width and breakpoints
                                                        />
                                                    </a>
                                                </div>
                                            ) : (
                                                // Placeholder: Apply similar constraints
                                                <div className="flex w-full max-w-xs aspect-video flex-shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30">
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">No Image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* --- Doors JSON Area (Bottom of Column 2) --- */}
                                        <div className="w-full"> {/* Container for JSON */}
                                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Exits (JSON)</h4>
                                            {/* Check if doors is an object and has keys */}
                                            {location.doors && typeof location.doors === 'object' && Object.keys(location.doors).length > 0 ? (
                                                <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-900/50 rounded-md overflow-auto text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                    <code>
                                                        {JSON.stringify(location.doors, null, 2)}
                                                    </code>
                                                </pre>
                                            ) : (
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">No exits defined.</p>
                                            )}
                                        </div>

                                    </div> {/* End Column 2 */}
                                </div> // End Row div
                            ))}
                        </div> {/* End List Container */}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
    //     <section className="flex-1 p-4 lg:p-8">
    //         <Card className="mb-8">
    //             <CardHeader>
    //             </CardHeader>
    //             <CardContent> {/* Rely on CardContent padding, removed extra p-4 div */}

    //                 {/* --- Added Title and Summary Blocks --- */}
    //                 <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700"> {/* Optional separator */}
    //                     {/* Block 1: Title */}
    //                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
    //                         In Game Purchase Summary
    //                     </h3>
    //                     {/* Container for the two summary stats */}
    //                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    //                         {/* Block 2: Total Count */}
    //                         <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
    //                             <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
    //                                 Total No. of Purchases:
    //                             </p>
    //                             <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
    //                                 {purchasesCount}
    //                             </p>
    //                         </div>
    //                         {/* Block 3: Total Value */}
    //                         <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
    //                             <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
    //                                 Total Value of Purchases:
    //                             </p>
    //                             <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
    //                                 {formatCurrency(purchasesTotal)}
    //                             </p>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 {/* --- End Added Blocks --- */}

    //                 <div className="overflow-x-auto"> {/* Keep horizontal scroll */}
    //                     {/* Simplified table styling - letting Card provide the container */}
    //                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    //                         {/* Refined thead styling */}
    //                         <thead className="bg-gray-50 dark:bg-gray-800/50">
    //                             {/* Or use border instead of bg: <thead className="border-b border-gray-200 dark:border-gray-700"> */}
    //                             <tr>
    //                                 {/* Refined th styling */}
    //                                 <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">User Name</th>
    //                                 <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Item Name</th>
    //                                 <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
    //                                 <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Quantity</th>
    //                                 <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Purchase Date</th>
    //                                 <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Image</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
    //                             {allPurchases.map((purchase) => (
    //                                 // Added hover effect
    //                                 <tr key={purchase.userPurchaseId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
    //                                     {/* Refined td styling */}
    //                                     <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white align-middle whitespace-nowrap">{purchase.userName}</td>
    //                                     <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">{purchase.itemName}</td>
    //                                     {/* Formatted Price */}
    //                                     <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">{formatCurrency(purchase.price)}</td>
    //                                     <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle">{purchase.quantity}</td>
    //                                     {/* Formatted Date */}
    //                                     <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">
    //                                         {purchase.purchaseDate ? purchase.purchaseDate.toLocaleDateString('en-CA') : 'N/A'} {/* Example: YYYY-MM-DD format */}
    //                                     </td>
    //                                     <td className="py-4 px-6 align-middle">
    //                                         {/* Use next/image */}
    //                                         <a href={purchase.itemImageLink} target="_blank" rel="noopener noreferrer" className="block relative h-12 w-12 overflow-hidden rounded-md"> {/* Sized container */}
    //                                             <Image
    //                                                 src={purchase.itemImageLink}
    //                                                 alt={purchase.itemName}
    //                                                 fill // Fill the container
    //                                                 style={{ objectFit: 'cover' }} // Cover the area
    //                                                 sizes="3rem" // Hint for optimization (approx 48px)
    //                                             />
    //                                         </a>
    //                                     </td>
    //                                 </tr>
    //                             ))}
    //                         </tbody>
    //                     </table>
    //                 </div>
    //             </CardContent>
    //         </Card>
    //     </section>
    // );
}