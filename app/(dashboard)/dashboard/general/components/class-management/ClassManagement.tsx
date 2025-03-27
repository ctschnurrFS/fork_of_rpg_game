"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Correct Button import
import { Loader2, ChevronDown } from "lucide-react"; // ChevronDown is from lucide-react

type CharacterClass =
  | "Fighter"
  | "Rogue"
  | "Barbarian"
  | "Warlock"
  | "Druid"
  | "Paladin"
  | "Sorcerer";

type User = {
  id: string;
  name: string;
  class?: CharacterClass;
  originalClass?: CharacterClass; // To track changes
};

export function ClassManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<{
    error?: string;
    success?: string;
  }>({});

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        // Store original class to track changes later
        const usersWithOriginal = data.map((user: User) => ({
          ...user,
          originalClass: user.class,
        }));
        setUsers(usersWithOriginal);
        setLoading(false);
      });
  }, []);

  const handleClassChange = (userId: string, newClass: CharacterClass) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, class: newClass } : user
      )
    );
  };

  const hasChanges = users.some((user) => user.class !== user.originalClass);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveState({});

    try {
      const changes = users
        .filter((user) => user.class !== user.originalClass)
        .map(({ id, class: newClass }) => ({ userId: id, newClass }));

      const response = await fetch("/api/users/update-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes }),
      });

      if (response.ok) {
        setSaveState({ success: "Classes updated successfully!" });
        // Update original classes to match current
        setUsers(
          users.map((user) => ({
            ...user,
            originalClass: user.class,
          }))
        );
      } else {
        setSaveState({ error: "Failed to save changes" });
      }
    } catch (error) {
      setSaveState({ error: "Network error occurred" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage User Classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ClassDropdown
                          currentClass={user.class}
                          originalClass={user.originalClass}
                          onChange={(newClass) =>
                            handleClassChange(user.id, newClass)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-4 items-center">
              {saveState.error && (
                <span className="text-red-500 text-sm">{saveState.error}</span>
              )}
              {saveState.success && (
                <span className="text-green-500 text-sm">
                  {saveState.success}
                </span>
              )}

              <Button
                onClick={handleSaveChanges}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Reusable dropdown component matching ClassSelector's style
function ClassDropdown({
  currentClass,
  originalClass,
  onChange,
}: {
  currentClass?: CharacterClass;
  originalClass?: CharacterClass;
  onChange: (cls: CharacterClass) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const classes: CharacterClass[] = [
    "Fighter",
    "Rogue",
    "Barbarian",
    "Warlock",
    "Druid",
    "Paladin",
    "Sorcerer",
  ];

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[200px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span>{currentClass || "Select class"}</span>
          {currentClass && currentClass === originalClass && (
            <span className="ml-2 bg-black text-white text-xs font-medium px-2 py-0.5 rounded">
              Current
            </span>
          )}
          {currentClass && currentClass !== originalClass && (
            <span className="ml-2 bg-green-800 text-white text-xs font-medium px-2 py-0.5 rounded">
              Changed
            </span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
          {classes.map((cls) => (
            <div
              key={cls}
              className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-accent ${
                currentClass === cls ? "bg-muted" : ""
              }`}
              onClick={() => {
                onChange(cls);
                setIsOpen(false);
              }}
            >
              <span>{cls}</span>
              {originalClass === cls ? (
                <span className="bg-black text-white text-xs font-medium px-2 py-0.5 rounded">
                  Original
                </span>
              ) : currentClass === cls ? (
                <span className="bg-green-800 text-white text-xs font-medium px-2 py-0.5 rounded">
                  Changed
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
