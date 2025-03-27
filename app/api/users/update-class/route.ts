// app/api/users/update-class/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle"; // Adjust this import to your actual Drizzle db import
import { users } from "@/lib/db/schema"; // Adjust to your schema path
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId, characterClass } = await request.json();

    if (!userId || !characterClass) {
      return NextResponse.json(
        { error: "User ID and character class are required" },
        { status: 400 }
      );
    }

    // Update the user's class using Drizzle
    const updatedUsers = await db
      .update(users)
      .set({ class: characterClass })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: "Character class updated successfully",
      user: updatedUsers[0],
    });
  } catch (error) {
    console.error("Error updating character class:", error);
    return NextResponse.json(
      { error: "Failed to update character class" },
      { status: 500 }
    );
  }
}
