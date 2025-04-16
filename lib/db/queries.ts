"use server";

import { desc, and, eq, isNull, count, sum } from "drizzle-orm";
import { db } from "./drizzle";
import { activityLogs, teamMembers, teams, users, game_locations, userPurchasesTable } from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";

export async function getUser() {
  try {
    // Get cookies from the server request context
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      console.info("[getUser] No session cookie found — user not logged in");
      return null;
    }

    // Decode and verify session token
    const sessionData = await verifyToken(sessionCookie.value);

    if (!sessionData?.user?.id) {
      console.error("[getUser] Invalid session token - missing user ID");
      return null;
    }

    // Fetch user from database if not soft-deleted
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("[getUser] Error fetching user:", error);
    return null;
  }
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getLocationData(location_id: string) {
  const result = await db
    .select()
    .from(game_locations)
    .where(eq(game_locations.location_id, location_id))
    .limit(1);

  return result[0];
}

export async function setUserLocation(userId: number, newLocation: string) {
  const result = await db.update(users)
    .set({ location_id: newLocation })
    .where(eq(users.id, userId));

  return result
}

export async function getUserPurchases(userIdToQuery: number) {

  const purchases = await db.select()
    .from(userPurchasesTable)
    .where(eq(userPurchasesTable.userId, userIdToQuery));

  // The result 'purchases' will be an array of matching purchase objects.
  // If the user has no purchases, it will be an empty array [].
  return purchases;
}


// Select the count, aliasing the result field to 'total'
export async function getPurchasesCount() {
  const purchasesCount = await db.select({
    total: count() // count() corresponds to COUNT(*)
  }).from(userPurchasesTable);

  const totalCount = purchasesCount[0]?.total ?? 0;
  return totalCount;
}

//
export async function getPurchasesTotal() {
  const result = await db.select({
    // Pass the actual price column schema here!
    totalPrice: sum(userPurchasesTable.price)
  }).from(userPurchasesTable);

  // The result is an array like [{ totalPrice: '1234.56' }] or [{ totalPrice: null }] if empty/all null
  // Access the 'totalPrice' property from the first element
  // Default to string '0' if the result is null or undefined
  const totalPriceString = result[0]?.totalPrice ?? '0';
  return totalPriceString;
}


export async function getLatestPurchase() {

  const latestPurchaseResult = await db
    .select() // Select all columns from the purchases table
    .from(userPurchasesTable)
    .orderBy(desc(userPurchasesTable.purchaseDate)) // Order by date DESCENDING (latest first)
    .limit(1); // Take only the first record  

  const latestPurchase = latestPurchaseResult.length > 0 ? latestPurchaseResult[0] : null;

  return latestPurchaseResult[0];
}









export async function getUsersCount() {
  const usersCount = await db.select({
    total: count() // count() corresponds to COUNT(*)
  }).from(users);

  const totalUsersCount = usersCount[0]?.total ?? 0;
  return totalUsersCount;
}


export async function getLocationsCount() {
  const locationsCount = await db.select({
    total: count() // count() corresponds to COUNT(*)
  }).from(game_locations);

  const totallocationssCount = locationsCount[0]?.total ?? 0;
  return totallocationssCount;
}

export async function getLatestOverallSignIn() {
  // noStore(); // Uncomment if you need fresh data on every request

  const signInAction = 'SIGN_IN';

  try {
    // Drizzle returns an array even for limit(1)
    const result = await db
      .select({
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        signInTime: activityLogs.timestamp // The timestamp from the log entry
      })
      .from(users) // Start from users
      .innerJoin(activityLogs, eq(users.id, activityLogs.userId)) // Join logs
      // Filter for the specific action
      .where(eq(activityLogs.action, signInAction))
      // --- OR use ilike for case-insensitive matching: ---
      // .where(ilike(activityLogs.action, signInAction))

      // Order by timestamp DESCENDING to get the latest first
      .orderBy(desc(activityLogs.timestamp))
      // Limit to only the single most recent record
      .limit(1);

    // Extract the first element if the array is not empty
    const latestSignIn = result.length > 0 ? result[0] : null;
    
    return latestSignIn;

  } catch (error) {
    console.error("Error fetching latest overall sign-in:", error);
    return null; // Return null on error
  }
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        teamMembers: {
          with: {
            team: {
              with: {
                teamMembers: {
                  with: {
                    user: {
                      columns: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) {
      console.warn(`[getTeamForUser] No user found with ID: ${userId}`);
      return null;
    }

    if (!result.teamMembers || result.teamMembers.length === 0) {
      console.info(`[getTeamForUser] User ${userId} has no team memberships`);
      return null;
    }

    const team = result.teamMembers[0]?.team;

    if (!team) {
      console.info(`[getTeamForUser] User ${userId} has no associated team`);
      return null;
    }

    return team;
  } catch (error) {
    console.error("[getTeamForUser] Error fetching team for user:", error);
    return null;
  }
}
