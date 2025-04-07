"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown } from "lucide-react";
import { useState } from "react";

type CharacterClass =
  | "Fighter"
  | "Rogue"
  | "Barbarian"
  | "Warlock"
  | "Druid"
  | "Paladin"
  | "Sorcerer";

type ClassSelectorProps = {
  user: {
    id: string;
    class?: CharacterClass;
  };
  selectedClass: CharacterClass | "";
  setSelectedClass: (cls: CharacterClass | "") => void;
  isClassPending: boolean;
  classState: {
    error?: string;
    success?: string;
  };
  handleClassSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function ClassSelector({
  user,
  selectedClass,
  setSelectedClass,
  isClassPending,
  classState,
  handleClassSubmit,
}: ClassSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
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
              isClassPending || !selectedClass || selectedClass === user?.class
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
  );
}
