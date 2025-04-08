import { redirect } from "next/navigation";
import { Settings } from "./settings";
import { getTeamForUser, getUser } from "@/lib/db/queries";

// Helper function to log debug information
function logDebugInfo(label: string, data: any) {
  console.log(`[DEBUG] ${label}:`, JSON.stringify(data, null, 2));
  // You can also send this to a logging service if needed
}

export default async function SettingsPage() {
  try {
    // Debug 1: Check if we're even reaching this component
    logDebugInfo("Dashboard page reached", {
      timestamp: new Date().toISOString(),
    });

    const user = await getUser();
    logDebugInfo("User data from getUser()", user);

    if (!user) {
      logDebugInfo("Redirecting to sign-in (no user)", {
        timestamp: new Date().toISOString(),
        cookies:
          typeof document !== "undefined"
            ? document.cookie
            : "Not available in SSR",
      });
      redirect("/sign-in");
    }

    // Debug 2: Check user authentication status
    logDebugInfo("User authentication status", {
      id: user.id,
      email: user.email,
      hasPassword: !!user.passwordHash,
      isDeleted: !!user.deletedAt,
    });

    let teamData = await getTeamForUser(user.id);
    logDebugInfo("Team data", teamData);

    // If no team data, we handle it gracefully without throwing an error
    if (!teamData) {
      logDebugInfo("User has no team, allowing them to continue", {
        userId: user.id,
        userEmail: user.email,
      });
      // Optionally, display a message or render fallback UI
      teamData = { id: null, name: "No Team", teamMembers: [] };
    }

    // Debug 3: Final successful render
    logDebugInfo("Rendering dashboard successfully", {
      userId: user.id,
      teamId: teamData.id,
      timestamp: new Date().toISOString(),
    });

    return <Settings teamData={teamData} />;
  } catch (error) {
    // Debug 4: Catch any unexpected errors
    logDebugInfo("Dashboard page error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Optionally redirect to error page or sign-in
    redirect("/sign-in");
  }
}
