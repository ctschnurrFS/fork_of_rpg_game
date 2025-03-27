"use client";

import { use, useState, startTransition } from "react";
import { useActionState } from "react";
import { useUser } from "@/lib/auth";
import { AccountInfoCard } from "./components/AccountInfoCard";
import { ClassSelector } from "./components/class-management/ClassSelector";
import { ClassManagement } from "./components/class-management/ClassManagement";
import { updateAccount } from "@/app/(login)/actions";
import { updateUserClass } from "./components/class-management/userActions";

type CharacterClass =
  | "Fighter"
  | "Rogue"
  | "Barbarian"
  | "Warlock"
  | "Druid"
  | "Paladin"
  | "Sorcerer";

type ActionState = {
  error?: string;
  success?: string;
};

export default function GeneralPage() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | "">(
    user?.class || ""
  );

  // Account form
  const [accountState, accountFormAction, isAccountPending] = useActionState<
    ActionState,
    FormData
  >(updateAccount, { error: "", success: "" });

  // Class form
  const [classState, classAction, isClassPending] = useActionState<
    ActionState,
    { userId: string; newClass: CharacterClass | "" }
  >(
    async (_, formData) => {
      return await updateUserClass(formData.userId, formData.newClass);
    },
    { error: "", success: "" }
  );

  const handleClassSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) return;
    await new Promise<void>((resolve) => {
      startTransition(() => {
        classAction({
          userId: String(user.id),
          newClass: selectedClass,
        });
        resolve();
      });
    });
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        General Settings
      </h1>

      <AccountInfoCard
        user={{
          name: user?.name ?? undefined,
          email: user?.email ?? undefined,
        }}
        accountState={accountState}
        isAccountPending={isAccountPending}
        accountFormAction={accountFormAction}
      />

      {user?.role === "regular" ? (
        <ClassSelector
          user={{
            id: String(user.id),
            class: user.class as CharacterClass | undefined,
          }}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          isClassPending={isClassPending}
          classState={classState}
          handleClassSubmit={handleClassSubmit}
        />
      ) : (
        <ClassManagement />
      )}
    </section>
  );
}
