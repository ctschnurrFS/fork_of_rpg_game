// app/api/users/route.ts (new file)
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        class: users.class,
      })
      .from(users);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
