"use client";

import { useState } from "react";

export default function RoleCategory({ title, roles }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Role demand levels (simulated)
  const getRoleDemand = (role) => {
    const highDemandRoles = ["Java Developer", "Cloud Engineer", "Data Scientist", "DevOps Engineer", "Full Stack Developer"];
    const mediumDemandRoles = ["Frontend Developer", "Backend Developer", "QA Engineer", "UI/UX Designer"];
    if (highDemandRoles.some(r => role.includes(r))) return { level: "High", color: "green", percentage: 95 };
    if (mediumDemandRoles.some(r => role.includes(r))) return { level: "Medium", color: "yellow", percentage: 75 };
    return { level: "Good", color: "blue", percentage: 65 };
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg sm:shadow-xl p-5 sm:p-6 border border-gray-200 hover:shadow-2xl hover:border-primary-300 transition-all duration-300 group relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      

      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
            {title}
          </h3>
        </div>

        {/* Roles List */}
        <ul className="space-y-2.5 sm:space-y-3">
          {roles.map((role, index) => {
            const demand = getRoleDemand(role);
            const isHovered = hoveredIndex === index;
            
            return (
              <li
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex items-start gap-3 text-gray-700 text-sm sm:text-base group/item relative"
              >
                {/* Animated Bullet */}
                <div className="relative mt-1.5 flex-shrink-0">
                  <span className={`w-2.5 h-2.5 bg-primary-600 rounded-full transition-all duration-300 ${isHovered ? 'scale-150 bg-gradient-to-r from-primary-500 to-blue-500' : ''}`}></span>
                  {isHovered && (
                    <span className="absolute inset-0 w-2.5 h-2.5 bg-primary-400 rounded-full animate-ping"></span>
                  )}
                </div>

                {/* Role Name and Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-medium transition-colors ${isHovered ? 'text-primary-600' : 'text-gray-900'}`}>
                      {role}
                    </span>
                    {/* Demand Indicator */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                      demand.color === 'green' ? 'bg-green-100 text-green-700' :
                      demand.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    } ${isHovered ? 'scale-110' : 'scale-100'}`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <span>{demand.level}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar (shown on hover) */}
                  {isHovered && (
                    <div className="mt-2 space-y-1 animate-fade-in">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Market Demand</span>
                        <span className="font-semibold">{demand.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            demand.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            demand.color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            'bg-gradient-to-r from-blue-400 to-blue-600'
                          }`}
                          style={{ width: `${demand.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer Badge */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{roles.length} Career Paths</span>
          </div>
        </div>
      </div>
    </div>
  );
}
