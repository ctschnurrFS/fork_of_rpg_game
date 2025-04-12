import { redirect } from "next/navigation";
// import { Settings } from "./settings";
import { getTeamForUser, getUser } from "@/lib/db/queries";
import Link from 'next/link';
import { formatCurrency } from "@/lib/utils"
import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPurchasesCount, getPurchasesTotal, getUsersCount, getLocationsCount, getLatestPurchase, getLatestOverallSignIn } from "@/lib/db/queries"

// Helper function to log debug information
function logDebugInfo(label: string, data: any) {
  console.log(`[DEBUG] ${label}:`, JSON.stringify(data, null, 2));
  // You can also send this to a logging service if needed
}

export default async function SettingsPage() {

  const purchasesCount = await getPurchasesCount();
  const purchasesTotal = await getPurchasesTotal();
  const usersCount = await getUsersCount();
  const locationsCount = await getLocationsCount();
  const latestPurchase = await getLatestPurchase();
  const latestSignIn = await getLatestOverallSignIn();

  try {
    // Debug 1: Check if we're even reaching this component
    logDebugInfo("Dashboard page reached", {
      timestamp: new Date().toISOString(),
    });

    const user = await getUser();
    logDebugInfo("User data from getUser()", user);

    if (!user) {
      logDebugInfo("Redirecting to sign-in (no user)", {
        timestamp: new Date().toISOString(),
        cookies:
          typeof document !== "undefined"
            ? document.cookie
            : "Not available in SSR",
      });
      redirect("/sign-in");
    }

    // Debug 2: Check user authentication status
    logDebugInfo("User authentication status", {
      id: user.id,
      email: user.email,
      hasPassword: !!user.passwordHash,
      isDeleted: !!user.deletedAt,
    });

    let teamData = await getTeamForUser(user.id);
    logDebugInfo("Team data", teamData);

    // If no team data, we handle it gracefully without throwing an error
    if (!teamData) {
      logDebugInfo("User has no team, allowing them to continue", {
        userId: user.id,
        userEmail: user.email,
      });
      // Optionally, display a message or render fallback UI
      teamData = { id: null, name: "No Team", teamMembers: [] };
    }

    // Debug 3: Final successful render
    logDebugInfo("Rendering dashboard successfully", {
      userId: user.id,
      teamId: teamData.id,
      timestamp: new Date().toISOString(),
    });

    //return <Settings teamData={teamData} />;

    return (
      <section className="flex-1 p-4 lg:p-8">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
          Game Dashboard
        </h1>

        {/* Wrap the three cards in a div with grid classes */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          <Link href="dashboard/purchase/purchaselist" className="block hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="
              transition-all duration-300 ease-in-out  /* --- Base transition --- */
              hover:shadow-xl                         /* --- Increased shadow on hover --- */
              hover:scale-[1.03]                      /* --- Scale up slightly (3%) on hover --- */
              ">
              <CardHeader>
                <CardTitle>No. Game Purchases</CardTitle>
                <div className="mt-1 mb-2 h-px w-full bg-gray-300 dark:bg-gray-600" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{purchasesCount}</p>
                <div className="mb-4 h-30 w-30 relative pt-2"> {/* Container for responsive image */}
                  <img
                    src={latestPurchase.itemImageLink}
                    alt={latestPurchase.itemName ?? 'Purchased item'} // Added nullish coalescing for safety
                    // Explicit size (w-20/h-20 = 5rem = 80px) and object-fit
                    className="w-30 h-30 object-cover rounded-md"
                  // You might want rounded corners, etc.
                  // className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
                <p>Latest Purchase:</p>
                {latestPurchase.itemName}
                <p>
                  {latestPurchase.purchaseDate ? latestPurchase.purchaseDate.toLocaleDateString('en-CA') : 'N/A'}
                </p>

              </CardContent>
            </Card>
          </Link>
          <Link href="dashboard/purchase/purchaselist" className="block hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="
              transition-all duration-300 ease-in-out  /* --- Base transition --- */
              hover:shadow-xl                         /* --- Increased shadow on hover --- */
              hover:scale-[1.03]                      /* --- Scale up slightly (3%) on hover --- */
              ">
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <div className="mt-1 mb-2 h-px w-full bg-gray-300 dark:bg-gray-600" />
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">

                {/* <p className="text-2xl lg:text-4xl text-gray-900 dark:text-gray-100"> */}
                <p className="text-3xl font-bold">
                  {formatCurrency(purchasesTotal)}
                </p>

                <div className="mb-4 h-30 w-30 relative pt-2"> {/* Container for responsive image */}

                  <img
                    src="/images/treasure_chest.png"
                    alt="Revenue illustration" // Descriptive alt text
                    // Explicit size (w-20/h-20 = 5rem = 80px) and object-fit
                    className="w-30 h-30 object-cover rounded-md"
                  // You might want rounded corners, etc.
                  // className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
                <p>&nbsp;</p>
                &nbsp;
                <p>
                  &nbsp;
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="dashboard/userslist" className="block hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="
              transition-all duration-300 ease-in-out  /* --- Base transition --- */
              hover:shadow-xl                         /* --- Increased shadow on hover --- */
              hover:scale-[1.03]                      /* --- Scale up slightly (3%) on hover --- */
              ">
              <CardHeader>
                <CardTitle>Number Users</CardTitle>
                <div className="mt-1 mb-2 h-px w-full bg-gray-300 dark:bg-gray-600" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{usersCount}</p>

                <div className="mb-4 h-30 w-30 relative pt-2"> {/* Container for responsive image */}

                  <img
                    src="/images/people.png"
                    alt="Revenue illustration" // Descriptive alt text
                    // Explicit size (w-20/h-20 = 5rem = 80px) and object-fit
                    className="w-30 h-30 object-cover rounded-md"
                  // You might want rounded corners, etc.
                  // className="w-20 h-20 object-cover rounded-md"
                  />
                </div>

                <p>Latest Sign In:</p>
                {latestSignIn?.userName}
                <p>
                  {latestSignIn?.signInTime ? latestSignIn?.signInTime.toLocaleDateString('en-CA') : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="dashboard/gamelocations" className="block hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="
              transition-all duration-300 ease-in-out  /* --- Base transition --- */
              hover:shadow-xl                         /* --- Increased shadow on hover --- */
              hover:scale-[1.03]                      /* --- Scale up slightly (3%) on hover --- */
              ">
              <CardHeader>
                <CardTitle>Game Locations</CardTitle>
                <div className="mt-1 mb-2 h-px w-full bg-gray-300 dark:bg-gray-600" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{locationsCount}</p>

                <div className="mb-4 h-30 w-30 relative pt-2"> {/* Container for responsive image */}
                  <img
                    src="/images/room.png"
                    alt="Revenue illustration" // Descriptive alt text
                    // Explicit size (w-20/h-20 = 5rem = 80px) and object-fit
                    className="w-30 h-30 object-cover rounded-md"
                  // You might want rounded corners, etc.
                  // className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
                <p>&nbsp;</p>
                &nbsp;
                <p>
                  &nbsp;
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section >
    )

  } catch (error) {
    // Debug 4: Catch any unexpected errors
    logDebugInfo("Dashboard page error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Optionally redirect to error page or sign-in
    redirect("/sign-in");
  }
}
