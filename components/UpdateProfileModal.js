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

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setMobileNo(user.mobileNo || "");
      setState(user.state || "");
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
      await updateUserProfile({ name, mobile_no: mobileNo, state });
      onClose();
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
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
          Update Profile
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

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
              onChange={(e) => setMobileNo(e.target.value)}
              required
            />
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
              {states.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
