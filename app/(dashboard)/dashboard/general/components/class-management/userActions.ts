"use server";

import { revalidatePath } from "next/cache";

type CharacterClass =
  | "Fighter"
  | "Rogue"
  | "Barbarian"
  | "Warlock"
  | "Druid"
  | "Paladin"
  | "Sorcerer";

export async function updateUserClass(
  userId: string,
  newClass: CharacterClass | ""
): Promise<{
  error?: string;
  success?: string;
}> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/users/update-class`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, characterClass: newClass || null }),
      }
    );

    if (!response.ok) throw new Error("Failed to update class");

    revalidatePath("/dashboard/general");
    return { success: "Class updated successfully" };
  } catch (error) {
    console.error("Update class error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update class",
    };
  }
}
