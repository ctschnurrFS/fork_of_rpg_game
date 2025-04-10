import { db, } from '@/lib/db/drizzle'
import { formatCurrency } from "@/lib/utils"
import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { userPurchasesTable } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { desc } from 'drizzle-orm';
import { getPurchasesCount, getPurchasesTotal, getUsersCount, getLocationsCount } from "@/lib/db/queries"
import { Users, Settings, Shield, Activity, Menu, DollarSign, LayoutDashboard } from 'lucide-react';

export default async function admindashboard() {

    // const allPurchases = await db
    //     .select()
    //     .from(userPurchasesTable)
    //     .orderBy(desc(userPurchasesTable.purchaseDate));

    const purchasesCount = await getPurchasesCount();
    const purchasesTotal = await getPurchasesTotal();
    const usersCount = await getUsersCount();
    const locationsCount = await getLocationsCount();

    return (

        <section className="flex-1 p-4 lg:p-8">
            <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
                Game Dashboard
            </h1>

            {/* Wrap the three cards in a div with grid classes */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">


                <Card>
                    <CardHeader>
                        <CardTitle>No. Game Purchases</CardTitle>
                        <div className="mt-1 mb-2 h-px w-full bg-gray-300 dark:bg-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{purchasesCount}</p>
                        <p></p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                        <div className="mt-1 mb-2 h-px w-full bg-gray-300 dark:bg-gray-600" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">

                        <div className="mb-4 h-30 w-30 relative"> {/* Container for responsive image */}
                            <Image
                                src="/images/gold_coins.png"
                                alt="Revenue illustration" // Descriptive alt text
                                fill // Use fill to make image responsive within the container
                                style={{ objectFit: 'contain' }} // 'contain' or 'cover'
                                sizes="(max-width: 768px) 10vw, 5vw" // Optional: help optimize image loading
                            />
                        </div>

                        <p className="text-2xl lg:text-4xl text-gray-900 dark:text-gray-100">
                            {/* Use the formatting function */}
                            {formatCurrency(purchasesTotal)}
                        </p>

                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Number Users</CardTitle>
                        <div className="mt-1 mb-2 h-px w-full bg-gray-300 dark:bg-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{usersCount}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Game Locations</CardTitle>
                        <div className="mt-1 mb-2 h-px w-full bg-gray-300 dark:bg-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{locationsCount}</p>
                    </CardContent>
                </Card>

            </div>
        </section>
    )
}   