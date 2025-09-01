"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {api} from "@/lib/api";

export default function DeleteAccountDialog({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await api.users.delete(userId);
			if (res.error) throw new Error(res.error.message || "Failed to delete account");

      toast.success("Account Successfully Deleted")
      await signOut({ callbackUrl: "/" });
    } catch (e: any) {
      toast.error(e.message || "Failed to delete account. Please try again.")
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <span className="primary-text-gradient inline-block w-fit bg-clip-text text-transparent">
              Are You Sure?
            </span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex w-full justify-between">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>Cancel</Button>
            </DialogClose>
            <Button
              className="primary-gradient"
              onClick={onDelete}
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? "Deleting…" : "Delete Account"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
