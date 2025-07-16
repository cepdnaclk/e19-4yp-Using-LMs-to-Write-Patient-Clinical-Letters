"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUserInjured, 
  faFileAlt, 
  faHistory, 
  faChartLine, 
  faCog 
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="h-screen bg-white shadow-lg w-64 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          {/* <Image 
            src="/images/icons/medical-document.svg" 
            alt="MediScribe Logo" 
            width={32} 
            height={32} 
            className="mr-2"
          /> */}
          <span className="text-blue-600 font-bold text-xl">MediScribe</span>
        </div>
        <div className="flex-grow py-4 px-2">
          <nav className="space-y-2">
            <Link href="/" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faHome} className="h-5 w-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/patients" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faUserInjured} className="h-5 w-5 mr-3" />
              <span className="font-medium">Patients</span>
            </Link>
            <Link href="/generate" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faFileAlt} className="h-5 w-5 mr-3" />
              <span className="font-medium">Generate Letter</span>
            </Link>
            <Link href="/history" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faHistory} className="h-5 w-5 mr-3" />
              <span className="font-medium">History</span>
            </Link>
            <Link href="/analytics" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 mr-3" />
              <span className="font-medium">Analytics</span>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link href="/settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
            <FontAwesomeIcon icon={faCog} className="h-5 w-5 mr-3" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
