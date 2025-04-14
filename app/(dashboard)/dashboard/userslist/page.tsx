import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { desc } from 'drizzle-orm';
import React from 'react';
import Image from 'next/image';
import { getUsersCount } from "@/lib/db/queries"

export default async function purchaselist() {

    //const allPurchases = await db.select().from(userPurchasesTable);

    const allUsers = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt));

    const usersCount = await getUsersCount();
    // const purchasesTotal = await getPurchasesTotal();

    return (
        <section className="flex-1 p-4 lg:p-8">
            <Card className="mb-8">
                <CardHeader>
                </CardHeader>
                <CardContent> {/* Rely on CardContent padding, removed extra p-4 div */}

                    {/* --- Added Title and Summary Blocks --- */}
                    <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700"> {/* Optional separator */}
                        {/* Container for the two summary stats */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                    RPG Game Users
                                </p>
                            </div>                            
                            <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total No. of Users:
                                </p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {usersCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto"> {/* Keep horizontal scroll */}
                        {/* Simplified table styling - letting Card provide the container */}
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Refined thead styling */}
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                {/* Or use border instead of bg: <thead className="border-b border-gray-200 dark:border-gray-700"> */}
                                <tr>
                                    {/* Refined th styling */}
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">User Name</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Class</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</th>
                                    <th scope="col" className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Game Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {allUsers.map((user) => (
                                    // Added hover effect
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        {/* Refined td styling */}
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white align-middle whitespace-nowrap">{user.name}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">{user.email}</td>
                                        {/* Formatted Price */}
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">{user.role}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle">{user.class}</td>
                                        {/* Formatted Date */}
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle whitespace-nowrap">
                                            {user.createdAt ? user.createdAt.toLocaleDateString('en-CA') : 'N/A'} {/* Example: YYYY-MM-DD format */}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 align-middle">{user.location_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}