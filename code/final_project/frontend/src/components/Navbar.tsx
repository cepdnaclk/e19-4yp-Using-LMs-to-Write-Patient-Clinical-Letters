"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 ">
              <Link href="/" className="flex items-center mr-8">
                {/* <Image 
                  src="/images/logomed.png" 
                  alt="MediScribe Logo" 
                  width={102} 
                  height={102} 
                  className="mr-2"
                /> */}
                <span className="text-white font-bold text-2xl ">MediScribe</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/patients"
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Patients
                </Link>
                <Link
                  href="/generate"
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Generate Letter
                </Link>
                <Link
                  href="/history"
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  History
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-blue-700 p-1 rounded-full text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
                <FontAwesomeIcon icon={faUser} className="h-5 w-6" />
              </button>
              <button
                onClick={() => {
                  // signOut(); // Uncomment if using NextAuth.js or handle logout logic
                  console.log("Signing out...");
                }}
                className="ml-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Sign out
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
            >
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/patients"
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Patients
            </Link>
            <Link
              href="/generate"
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Generate Letter
            </Link>
            <Link
              href="/history"
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              History
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-10 w-10 text-white"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  Dr. John Doe
                </div>
                <div className="text-sm font-medium leading-none text-blue-200">
                  doctor@example.com
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 w-full text-left">
                Profile
              </button>
              <button className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 w-full text-left">
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
