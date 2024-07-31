"use client";
import React from "react";

const SignOutButton: React.FC = () => {
  const handleSignOut = () => {
    // Handle sign-out logic here
    console.log("User signed out");
  };

  return (
    <button onClick={handleSignOut} style={{ margin: "1rem" }}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
