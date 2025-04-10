import { db } from '@/lib/db/drizzle'
import { userPurchasesTable } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { desc } from 'drizzle-orm';
import React from 'react';
import Image from 'next/image';
import { formatCurrency } from "@/lib/utils"
import { getPurchasesCount, getPurchasesTotal } from "@/lib/db/queries"

export default async function purchaselist() {

    //const allPurchases = await db.select().from(userPurchasesTable);

    const allPurchases = await db
        .select()
        .from(userPurchasesTable)
        .orderBy(desc(userPurchasesTable.purchaseDate));

    const purchasesCount = await getPurchasesCount();
    const purchasesTotal = await getPurchasesTotal();

    return (
        <section className="flex-1 p-4 lg:p-8">
            <Card className="mb-8">
                <CardHeader>
                </CardHeader>
                <CardContent> {/* Rely on CardContent padding, removed extra p-4 div */}

                    {/* --- Added Title and Summary Blocks --- */}
                    <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700"> {/* Optional separator */}
                        {/* Block 1: Title */}
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            In Game Purchase Summary
                        </h3>
                        {/* Container for the two summary stats */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Block 2: Total Count */}
                            <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total No. of Purchases:
                                </p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {purchasesCount}
                                </p>
                            </div>
                            {/* Block 3: Total Value */}
                            <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Value of Purchases:
                                </p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(purchasesTotal)}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* --- End Added Blocks --- */}

                    <div className="overflow-x-auto"> {/* Keep horizontal scroll */}
                        {/* Simplified table styling - letting Card provide the container */}
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Refined thead styling */}
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                {/* Or use border instead of bg: <thead className="border-b border-gray-200 dark:border-gray-700"> */}
                                <tr>
                                    {/* Refined th styling */}
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">User Name</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Item Name</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Quantity</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Purchase Date</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Image</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {allPurchases.map((purchase) => (
                                    // Added hover effect
                                    <tr key={purchase.userPurchaseId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        {/* Refined td styling */}
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white align-middle whitespace-nowrap">{purchase.userName}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">{purchase.itemName}</td>
                                        {/* Formatted Price */}
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">{formatCurrency(purchase.price)}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle">{purchase.quantity}</td>
                                        {/* Formatted Date */}
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">
                                            {purchase.purchaseDate ? purchase.purchaseDate.toLocaleDateString('en-CA') : 'N/A'} {/* Example: YYYY-MM-DD format */}
                                        </td>
                                        <td className="py-4 px-6 align-middle">
                                            {/* Use next/image */}
                                            <a href={purchase.itemImageLink} target="_blank" rel="noopener noreferrer" className="block relative h-12 w-12 overflow-hidden rounded-md"> {/* Sized container */}
                                                <Image
                                                    src={purchase.itemImageLink}
                                                    alt={purchase.itemName}
                                                    fill // Fill the container
                                                    style={{ objectFit: 'cover' }} // Cover the area
                                                    sizes="3rem" // Hint for optimization (approx 48px)
                                                />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </section>
    );

    // return (

    //     <section className="flex-1 p-4 lg:p-8">
    //         <Card className="mb-8">

    //             <CardHeader>
    //                 <CardTitle>User Purchases</CardTitle>
    //             </CardHeader>
    //             <CardContent>

    //                 <div className="p-4">
    //                     <div className="overflow-x-auto"> {/* Add horizontal scrolling if needed */}
    //                         <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
    //                             <thead className="bg-gray-100">
    //                                 <tr>
    //                                     <th className="py-2 px-4 text-left font-semibold text-gray-700">User Name</th>
    //                                     <th className="py-2 px-4 text-left font-semibold text-gray-700">Item Name</th>
    //                                     <th className="py-2 px-4 text-left font-semibold text-gray-700">Price</th>
    //                                     <th className="py-2 px-4 text-left font-semibold text-gray-700">Quantity</th>
    //                                     <th className="py-2 px-4 text-left font-semibold text-gray-700">Purchase Date</th>
    //                                     <th className="py-2 px-4 text-left font-semibold text-gray-700">Image</th>
    //                                 </tr>
    //                             </thead>
    //                             <tbody>
    //                                 {allPurchases.map((purchase) => (
    //                                     <tr key={purchase.userPurchaseId} className="border-b border-gray-200">
    //                                         <td className="py-2 px-4">{purchase.userName}</td>
    //                                         <td className="py-2 px-4">{purchase.itemName}</td>
    //                                         <td className="py-2 px-4">${purchase.price}</td>
    //                                         <td className="py-2 px-4">{purchase.quantity}</td>
    //                                         <td className="py-2 px-4">{purchase.purchaseDate ? purchase.purchaseDate.toLocaleString() : 'N/A'}</td> 
    //                                         <td className="py-2 px-4">
    //                                             <a href={purchase.itemImageLink} target="_blank" rel="noopener noreferrer">  
    //                                             <img src={purchase.itemImageLink} alt={purchase.itemName} className="w-16 h-16 rounded-lg" />
    //                                             </a>
    //                                         </td>
    //                                     </tr>
    //                                 ))}
    //                             </tbody>
    //                         </table>
    //                     </div>
    //                 </div>
    //             </CardContent>
    //         </Card>
    //     </section>

    // )
}