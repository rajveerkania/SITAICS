import React from "react";
import Image from "next/image";
import { NotificationDialog } from "./admin/AdminNotification";
import { LogoutButton } from "./LogoutButton";

export function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Image
          src="/sitaics.png"
          alt="SITAICS Logo"
          width={100}
          height={100}
          style={{ width: "auto", height: "auto" }}
          priority
        />
        <div className="flex items-center space-x-4">
          <NotificationDialog />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
