"use client";

import * as React from "react";
import {
  Settings,
  User,
  MapPin,
  CheckCircle2
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

export function CommandBar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Voter Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/register"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Update Registration</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/booth"))}>
            <MapPin className="mr-2 h-4 w-4" />
            <span>Find Polling Booth</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/documents"))}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Verify Documents</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/profile"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
