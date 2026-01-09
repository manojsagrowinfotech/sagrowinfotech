"use client";

import { useEffect, useState } from "react";
import { studentApi } from "@/lib/api";

export default function CreateStudentPage() {
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [state, setState] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("FRESHER");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [states, setStates] = useState([]);
  const [levels, setLevels] = useState([]);
  const [yearsOptions, setYearsOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [s, l, y] = await Promise.all([
          studentApi.getStates(),
          studentApi.getExperienceLevels(),
          studentApi.getYearsOfExperience(),
        ]);
        const statesData = s?.data?.states || [];
        const levelsData = l?.data?.experienceLevels || [];
        const yearsData = y?.data?.yearsOfExperience || [];
        setStates(statesData);
        setLevels(levelsData);
        setYearsOptions(yearsData);
        if (!state && statesData.length) setState(statesData[0].key);
        if (!experienceLevel && levelsData.length)
          setExperienceLevel(levelsData[0].key);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load options", e);
      }
    }
    loadOptions();
  }, []);

  const validate = () => {
    if (!name.trim()) return "Please enter a name";
    if (!emailId.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId))
      return "Please enter a valid email";
    if (!mobileNo.trim() || !/^\+?[0-9\s-]{7,15}$/.test(mobileNo))
      return "Please enter a valid mobile number";
    if (!state) return "Please select a state";
    if (experienceLevel === "EXPERIENCED" && !yearsOfExperience)
      return "Please select years of experience";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const payload = { name, mobileNo, emailId, experienceLevel, state };
      if (experienceLevel === "EXPERIENCED")
        payload.yearsOfExperience = yearsOfExperience;
      const res = await studentApi.createStudent(payload);
      setSuccess(res?.data?.message || "Student created successfully");
      setName("");
      setEmailId("");
      setMobileNo("");
      setExperienceLevel("FRESHER");
      setYearsOfExperience("");
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Submission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-10 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-primary-100 overflow-hidden">
          <div className="pt-8 px-6 sm:px-8 text-center bg-gradient-to-b from-primary-50 to-white">
            <div className="flex flex-col items-center gap-3">
              <img
                src="/images/logo-sagrowinfotech-badge.svg"
                alt="SAGROWINFOTECH"
                className="w-16 h-16 drop-shadow-sm"
              />
              <div className="text-xl font-bold text-primary-900">
                Create Student
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8 pt-4">
            <div className="h-1.5 bg-gradient-to-r from-primary-400 to-primary-700 rounded-full mb-6"></div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                {success}
              </div>
            )}
            <form
              onSubmit={submit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-primary-900 text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-primary-900 text-sm font-semibold mb-2">
                  Email ID
                </label>
                <input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-primary-900 text-sm font-semibold mb-2">
                  Mobile Number
                </label>
                <input
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-primary-900 text-sm font-semibold mb-2">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                >
                  {states.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-primary-900 text-sm font-semibold mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                >
                  {levels.map((l) => (
                    <option key={l.key} value={l.key}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              {experienceLevel === "EXPERIENCED" && (
                <div>
                  <label className="block text-primary-900 text-sm font-semibold mb-2">
                    Years of Experience
                  </label>
                  <select
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  >
                    {yearsOptions.map((y) => (
                      <option key={y.key} value={y.key}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="reset"
                  onClick={() => {
                    setName("");
                    setEmailId("");
                    setMobileNo("");
                    setExperienceLevel("FRESHER");
                    setYearsOfExperience("");
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-[0.98] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
