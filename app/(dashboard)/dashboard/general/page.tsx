"use client";

import { startTransition, use, useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown } from "lucide-react";
import { useUser } from "@/lib/auth";
import { updateAccount } from "@/app/(login)/actions";

type ActionState = {
  error?: string;
  success?: string;
};

type CharacterClass =
  | "Fighter"
  | "Rogue"
  | "Barbarian"
  | "Warlock"
  | "Druid"
  | "Paladin"
  | "Sorcerer";

export default function GeneralPage() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | "">(
    user?.class || ""
  );
  const [classState, setClassState] = useState<ActionState>({
    error: "",
    success: "",
  });
  const [isClassPending, setIsClassPending] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [accountState, accountFormAction, isAccountPending] = useActionState<
    ActionState,
    FormData
  >(updateAccount, { error: "", success: "" });

  const handleAccountSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      accountFormAction(new FormData(event.currentTarget));
    });
  };

  const handleClassSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id || !selectedClass || selectedClass === user.class) return;

    setIsClassPending(true);
    setClassState({ error: "", success: "" });

    try {
      // Use fetch API to call a route handler instead of direct DB access
      const response = await fetch("/api/update-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          characterClass: selectedClass,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setClassState({ success: result.success, error: "" });
        if (user) user.class = selectedClass;
      } else {
        setClassState({
          error: result.error || "Failed to update class",
          success: "",
        });
      }
    } catch (error) {
      setClassState({ error: "An unexpected error occurred", success: "" });
    } finally {
      setIsClassPending(false);
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        General Settings
      </h1>

      {/* Account Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleAccountSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                defaultValue={user?.name || ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                defaultValue={user?.email || ""}
                required
              />
            </div>
            {accountState.error && (
              <p className="text-red-500 text-sm">{accountState.error}</p>
            )}
            {accountState.success && (
              <p className="text-green-500 text-sm">{accountState.success}</p>
            )}
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isAccountPending}
            >
              {isAccountPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Character Class Card */}
      {user?.role === "regular" && (
        <Card>
          <CardHeader>
            <CardTitle>Character Class</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleClassSubmit} className="space-y-4">
              <div>
                <Label>Class</Label>
                <div className="relative">
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="flex items-center">
                      <span>{selectedClass || "Select your class"}</span>
                      {selectedClass && user?.class === selectedClass && (
                        <span className="ml-2 bg-black text-white text-xs font-medium px-2 py-0.5 rounded">
                          Current Class
                        </span>
                      )}
                      {selectedClass && user?.class !== selectedClass && (
                        <span className="ml-2 bg-green-800 text-white text-xs font-medium px-2 py-0.5 rounded">
                          Class Changed
                        </span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                      {[
                        "Fighter",
                        "Rogue",
                        "Barbarian",
                        "Warlock",
                        "Druid",
                        "Paladin",
                        "Sorcerer",
                      ].map((cls) => (
                        <div
                          key={cls}
                          className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-accent ${
                            selectedClass === cls ? "bg-muted" : ""
                          }`}
                          onClick={() => {
                            setSelectedClass(cls as CharacterClass);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span>{cls}</span>
                          {user?.class === cls ? (
                            <span className="bg-black text-white text-xs font-medium px-2 py-0.5 rounded">
                              Current Class
                            </span>
                          ) : selectedClass === cls ? (
                            <span className="bg-green-800 text-white text-xs font-medium px-2 py-0.5 rounded">
                              Class Changed
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {classState.error && (
                <p className="text-red-500 text-sm">{classState.error}</p>
              )}
              {classState.success && (
                <p className="text-green-500 text-sm">{classState.success}</p>
              )}
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={
                  isClassPending ||
                  !selectedClass ||
                  selectedClass === user?.class
                }
              >
                {isClassPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
