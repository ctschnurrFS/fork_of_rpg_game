"use server";

import { desc, and, eq, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import { activityLogs, teamMembers, teams, users, game_locations } from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";

export async function getUser() {
  try {
    // Get cookies from the server request context
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      console.error("[getUser] No session cookie found");
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
