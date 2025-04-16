"use client";

import React from 'react';
import Image from 'next/image';
import { use, useState, useEffect, startTransition, useActionState } from "react";
import { getUserPurchases } from "@/lib/db/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils"; // Import your currency formatter
import { AlertTriangle, Loader2 } from 'lucide-react'; // Icons for states

// Define the shape of a purchase object returned by getUserPurchases
interface PurchaseItem {
    userPurchaseId: string | number;
    itemName: string;
    price: string | number;
    itemImageLink: string;
}

// --- Change Props: Accept userId ---
interface PurchasesListCardProps {
    userId: string | number | null | undefined; // Accept user ID (allow null/undefined)
}

export function MyPurchasesListCard({ userId }: PurchasesListCardProps) {

    const [purchasesArray, setPurchasesArray] = useState<PurchaseItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Reset state when userId changes or component mounts
        setIsLoading(true);
        setError(null);
        setPurchasesArray([]);

        if (!userId) {
            // No user ID, don't fetch, just stop loading
            setIsLoading(false);
            // Optionally set an error or specific state here if needed
            // setError("User ID not provided.");
            return; // Exit effect
        }

        const fetchPurchases = async () => {
            try {
                const data = await getUserPurchases(userId);
                setPurchasesArray(data);
            } catch (err) {
                console.error(`Failed to fetch purchases for user ${userId}:`, err);
                setError("Could not load purchase data.");
                setPurchasesArray([]); // Ensure array is empty on error
            } finally {
                setIsLoading(false); // Stop loading whether success or error
            }
        };

        fetchPurchases();
    }, [userId]); // Dependency array: re-run effect if userId changes

    // --- Conditional Rendering Logic ---
    let cardContent: React.ReactNode;

    if (isLoading) {
        // 1. Loading State
        cardContent = (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
        );
    } else if (error) {
        // 2. Error State
        cardContent = (
            <div className="flex flex-col items-center justify-center text-center text-red-600 py-8">
                <AlertTriangle className="w-8 h-8 mb-2 text-red-500" />
                <p className="text-sm font-medium">{error}</p>
            </div>
        );
    } else if (!userId) {
        // 3. No User ID State (Optional, if you want a specific message)
        cardContent = (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                User not specified.
            </p>
        );
    } else if (purchasesArray.length === 0) {
        // 4. Empty State (Successfully loaded, but no data)
        cardContent = (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                No purchases found for this user.
            </p>
        );
    } else {
        // 5. Success State (Data loaded)
        cardContent = (
            <ul className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
                {purchasesArray.map((purchase) => (
                    <li key={purchase.userPurchaseId} className="flex items-center space-x-4 pt-4 first:pt-0">
                        {/* Image Container */}
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <Image
                                src={purchase.itemImageLink}
                                alt={purchase.itemName}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="3.5rem"
                            />
                        </div>
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {purchase.itemName}
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {formatCurrency(purchase.price)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Purchases</CardTitle>
                {/* Optionally show count only when loaded and not in error */}
                {!isLoading && !error && userId && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">({purchasesArray.length} items)</span>
                )}
            </CardHeader>
            <CardContent>
                {/* Render the determined content */}
                {cardContent}
            </CardContent>
        </Card>
    );
}