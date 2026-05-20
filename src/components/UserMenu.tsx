import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthModal } from "./AuthModal";
import { LogOut, User } from "lucide-react";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Giriş Yap
        </Button>
        <AuthModal open={open} onOpenChange={setOpen} />
      </>
    );
  }

  const initials = (user.user_metadata?.full_name || user.email || "U")
    .split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-2 p-2">
          <User className="h-4 w-4" />
          <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
