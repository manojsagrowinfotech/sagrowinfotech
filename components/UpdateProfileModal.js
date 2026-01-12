"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { studentApi } from "@/lib/api";

export default function UpdateProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [state, setState] = useState("");
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setMobileNo(user.mobileNo || "");
      setState(user.state || "");
      setIsEditing(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await studentApi.getStates();
        setStates(res?.data?.states || []);
        if (!state && res?.data?.states?.length)
          setState(res.data.states[0].key);
      } catch (e) {
        setError("Failed to fetch states");
      }
    };
    fetchStates();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!/^\d{10}$/.test(mobileNo)) {
        setError("Mobile number must be exactly 10 digits");
        setIsLoading(false);
        return;
      }
      await updateUserProfile({ name, mobile_no: mobileNo, state });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden border border-primary-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Profile
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{user?.fullName}</div>
                <div className="text-sm text-gray-500">{user?.role}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="text-sm">
                <span className="font-semibold text-gray-700">Email: </span>
                <span className="text-gray-600">{user?.emailId}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-700">Mobile: </span>
                <span className="text-gray-600">{user?.mobileNo}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-700">State: </span>
                <span className="text-gray-600">{user?.state}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="mobileNo"
              >
                Mobile No
              </label>
              <input
                id="mobileNo"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={mobileNo}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setMobileNo(val);
                }}
                required
              />
              <p className="mt-1 text-xs text-gray-500">Enter exactly 10 digits.</p>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="state"
              >
                State
              </label>
              <select
                id="state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 bg-primary-600 text-white font-bold rounded-md hover:bg-primary-700 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
