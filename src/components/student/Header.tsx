import React from "react";
import Image from "next/image";

interface HeaderProps {
  studentName: string;
}

const Header: React.FC<HeaderProps> = ({ studentName }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="SITAICS" width={50} height={50} />
          <h1 className="ml-2 text-xl font-bold text-black-500">SITAICS</h1>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Welcome {studentName}</span>
          <Image
            src="/profile-pic.jpg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border-2 border-gray-300"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;