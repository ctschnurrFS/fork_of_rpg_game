"use client";

import { use, useState, startTransition, useActionState } from "react";
import { useUser } from "@/lib/auth";
import { AccountInfoCard } from "@/app/(dashboard)/dashboard/general/components/AccountInfoCard";
import { MyPurchasesListCard } from "./components/MyPurchases";
import LocationDisplay from "./components/MyLocation";
import { updateAccount } from "@/app/(login)/actions"; // Update the path to the correct location

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Trash2, Loader2 } from 'lucide-react';
import { updatePassword, deleteAccount } from '@/app/(login)/actions';

import { ClassSelector } from "@/app/(dashboard)/dashboard/general/components/class-management/ClassSelector";
import { updateUserClass } from "@/app/(dashboard)/dashboard/general/components/class-management/userActions";
import { ClassManagement } from "@/app/(dashboard)/dashboard/general/components/class-management/ClassManagement";

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

  // Password and Delete Account forms
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    ActionState,
    FormData
  >(updatePassword, { error: '', success: '' });

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    ActionState,
    FormData
  >(deleteAccount, { error: '', success: '' });

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    // If you call the Server Action directly, it will automatically
    // reset the form. We don't want that here, because we want to keep the
    // client-side values in the inputs. So instead, we use an event handler
    // which calls the action. You must wrap direct calls with startTransition.
    // When you use the `action` prop it automatically handles that for you.
    // Another option here is to persist the values to local storage. I might
    // explore alternative options.
    startTransition(() => {
      passwordAction(new FormData(event.currentTarget));
    });
  };

  const handleDeleteSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    startTransition(() => {
      deleteAction(new FormData(event.currentTarget));
    });
  };

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
        My Account Details
      </h1>

      {/* Wrap the three cards in a div with grid classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        <LocationDisplay locationId={user.location_id}></LocationDisplay>

        <MyPurchasesListCard  userId={user.id}></MyPurchasesListCard>

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


        <AccountInfoCard
          user={{
            name: user?.name ?? undefined,
            email: user?.email ?? undefined,
          }}
          accountState={accountState}
          isAccountPending={isAccountPending}
          accountFormAction={accountFormAction}
        />

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  maxLength={100}
                />
              </div>
              {passwordState.error && (
                <p className="text-red-500 text-sm">{passwordState.error}</p>
              )}
              {passwordState.success && (
                <p className="text-green-500 text-sm">{passwordState.success}</p>
              )}
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isPasswordPending}
              >
                {isPasswordPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delete My Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Account deletion is non-reversable. Please proceed with caution.
            </p>
            <form onSubmit={handleDeleteSubmit} className="space-y-4">
              <div>
                <Label htmlFor="delete-password">Confirm Password</Label>
                <Input
                  id="delete-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  maxLength={100}
                />
              </div>
              {deleteState.error && (
                <p className="text-red-500 text-sm">{deleteState.error}</p>
              )}
              <Button
                type="submit"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeletePending}
              >
                {isDeletePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}