// app/(dashboard)/server-actions.ts
import { db, users } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";

type ActionResponse = {
  success?: string;
  error?: string;
};

export type CharacterClass =
  | "Fighter"
  | "Rogue"
  | "Barbarian"
  | "Warlock"
  | "Druid"
  | "Paladin"
  | "Sorcerer";

export async function getAllUsers() {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        class: users.class,
        role: users.role,
      })
      .from(users)
      .orderBy(users.name);

    return result;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function updateUserClass(
  userId: number, // Changed to number to match serial ID type
  characterClass: CharacterClass
): Promise<ActionResponse> {
  try {
    await db
      .update(users)
      .set({ class: characterClass })
      .where(eq(users.id, userId));

    return { success: "Class updated successfully" };
  } catch (error) {
    console.error("Error updating class:", error);
    return { error: "Failed to update class" };
  }
}
