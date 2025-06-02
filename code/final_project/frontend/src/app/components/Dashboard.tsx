"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faCalendarAlt,
  faFileAlt,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import letterService from "../../services/LetterService";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}

const DashboardCard = ({ title, value, icon, color }: DashboardCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("border-", "bg-")
            .replace("-500", "-100")}`}
        >
          <FontAwesomeIcon
            icon={icon}
            className={`h-6 w-6 ${color.replace("border-", "text-")}`}
          />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 248,
    todayAppointments: 12,
    lettersGenerated: 156,
    downloads: 98,
  });

  const [recentPatients, setRecentPatients] = useState([
    {
      id: "P-1001",
      name: "Alice Johnson",
      date: "2025-06-01",
      status: "Completed",
    },
    { id: "P-1002", name: "Bob Smith", date: "2025-06-01", status: "Pending" },
    {
      id: "P-1003",
      name: "Carol Williams",
      date: "2025-05-31",
      status: "Completed",
    },
    {
      id: "P-1004",
      name: "David Brown",
      date: "2025-05-31",
      status: "Completed",
    },
    { id: "P-1005", name: "Eva Davis", date: "2025-05-30", status: "Pending" },
  ]);

  const [recentLetters, setRecentLetters] = useState([
    {
      id: "L-2001",
      patient: "Alice Johnson",
      date: "2025-06-01",
      type: "Referral",
    },
    {
      id: "L-2002",
      patient: "Bob Smith",
      date: "2025-06-01",
      type: "Prescription",
    },
    {
      id: "L-2003",
      patient: "Carol Williams",
      date: "2025-05-31",
      type: "Discharge",
    },
    {
      id: "L-2004",
      patient: "David Brown",
      date: "2025-05-31",
      type: "Follow-up",
    },
    {
      id: "L-2005",
      patient: "Eva Davis",
      date: "2025-05-30",
      type: "Referral",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real integration, this would fetch data from the backend
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Example of API call that would be used in real integration
        const names = await letterService.getSampleNames();
        console.log("Sample names:", names);

        // For now, we're using mock data initialized above
        // In a real app, we would set the state with API response data
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            New Patient
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Generate Letter
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">
            Loading dashboard data...
          </span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Patients"
              value={stats.totalPatients}
              icon={faUserMd}
              color="border-blue-500"
            />
            <DashboardCard
              title="Today's Appointments"
              value={stats.todayAppointments}
              icon={faCalendarAlt}
              color="border-green-500"
            />
            <DashboardCard
              title="Letters Generated"
              value={stats.lettersGenerated}
              icon={faFileAlt}
              color="border-purple-500"
            />
            <DashboardCard
              title="Downloads"
              value={stats.downloads}
              icon={faDownload}
              color="border-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Patients
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPatients.map((patient, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              patient.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {patient.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Letters
              </h2>
              <div className="space-y-4">
                {recentLetters.map((letter, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {letter.patient}
                      </p>
                      <p className="text-sm text-gray-500">
                        {letter.type} Letter • {letter.date}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
