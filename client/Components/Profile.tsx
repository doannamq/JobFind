"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { Badge } from "./ui/badge";

function Profile() {
  const { userProfile } = useGlobalContext();
  const { profilePicture, name, professional, email } = userProfile;

  const router = useRouter();
  return (
    <DropdownMenu>
      <div className="flex items-center gap-4">
        <Badge>{professional}</Badge>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Image
            src={profilePicture ? profilePicture : "/user.png"}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs  leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push("http://localhost:8000/logout");
          }}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;
