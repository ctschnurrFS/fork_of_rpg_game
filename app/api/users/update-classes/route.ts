// app/api/users/update-classes/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { changes } = await request.json();

    if (!changes || !Array.isArray(changes)) {
      return NextResponse.json(
        { error: "Changes array is required" },
        { status: 400 }
      );
    }

    // Process all updates in a transaction
    const results = await db.transaction(async (tx) => {
      return Promise.all(
        changes.map(async ({ userId, newClass }) => {
          const updatedUsers = await tx
            .update(users)
            .set({ class: newClass })
            .where(eq(users.id, userId))
            .returning();

          return updatedUsers[0];
        })
      );
    });

    return NextResponse.json({
      success: `${changes.length} classes updated successfully`,
      updatedUsers: results,
    });
  } catch (error) {
    console.error("Error updating classes:", error);
    return NextResponse.json(
      { error: "Failed to update classes" },
      { status: 500 }
    );
  }
}
