"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type ActionState = {
  error?: string;
  success?: string;
};

type AccountInfoCardProps = {
  user: {
    name?: string;
    email?: string;
  };
  accountState: ActionState;
  isAccountPending: boolean;
  accountFormAction: (formData: FormData) => void;
};

export function AccountInfoCard({
  user,
  accountState,
  isAccountPending,
  accountFormAction,
}: AccountInfoCardProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    accountFormAction(new FormData(event.currentTarget));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <SubmitButton isPending={isAccountPending} />
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="bg-orange-500 hover:bg-orange-600 text-white"
      disabled={isPending || pending}
    >
      {isPending || pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
}
