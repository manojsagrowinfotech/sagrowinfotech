"use client";

import { useState, useEffect } from "react";
import { studentApi } from "@/lib/api";

export default function ContactModal({
  isOpen: controlledOpen,
  onClose,
  showButton = true,
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Sync internal state with controlled prop
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [experience, setExperience] = useState("FRESHER");
  const [years, setYears] = useState("");
  const [state, setState] = useState("");
  const [states, setStates] = useState([]);
  const [levels, setLevels] = useState([]);
  const [yearsOptions, setYearsOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [stateError, setStateError] = useState("");
  const [yearsError, setYearsError] = useState("");
  const [preferredTechnicalDomain, setPreferredTechnicalDomain] = useState("");
  const [preferredTechnicalDomainError, setPreferredTechnicalDomainError] =
    useState("");

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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load options", e);
      }
    }
    loadOptions();
  }, []);

  function resetForm() {
    setName("");
    setEmail("");
    setMobile("");
    setExperience("FRESHER");
    setYears("");
    setState(states[0]?.key || "");
    setError(null);
    setSuccess(null);
    setNameError("");
    setEmailError("");
    setMobileError("");
    setStateError("");
    setYearsError("");
    setPreferredTechnicalDomain("");
    setPreferredTechnicalDomainError("");
  }

  function validate() {
    setNameError("");
    setEmailError("");
    setMobileError("");
    setStateError("");
    setYearsError("");
    setPreferredTechnicalDomainError("");
    let hasError = false;
    if (!name.trim()) {
      setNameError("Please enter your name");
      hasError = true;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email Id");
      hasError = true;
    }
    if (!mobile.trim() || !/^\+?[0-9\s-]{7,15}$/.test(mobile)) {
      setMobileError("Please enter a valid mobile number");
      hasError = true;
    }
    if (!state) {
      setStateError("Please select your state");
      hasError = true;
    }
    if (experience === "EXPERIENCED" && !years) {
      setYearsError("Please select years of experience");
      hasError = true;
    }
    const domain = preferredTechnicalDomain.trim();
    if (!domain || !/^[A-Za-z\s]{1,100}$/.test(domain)) {
      setPreferredTechnicalDomainError(
        "Alphabetic characters and spaces only. Max length: 100"
      );
      hasError = true;
    }
    return !hasError;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const ok = validate();
    if (!ok) {
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name,
        mobileNo: mobile,
        emailId: email,
        experienceLevel: experience,
        state,
        preferredTechnicalDomain: preferredTechnicalDomain.trim(),
      };
      if (experience === "EXPERIENCED") {
        payload.yearsOfExperience = years;
      }
      const res = await studentApi.createStudent(payload);
      const msg = res?.data?.message || "Student created successfully";
      setSuccess(msg);
      resetForm();
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Submission failed"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const handleOpen = () => {
    if (onClose) {
      // If controlled, we can't directly open it - this shouldn't be called when controlled
      // But for backward compatibility with showButton=true, we use internal state
      setInternalOpen(true);
    } else {
      setInternalOpen(true);
    }
  };

  return (
    <>
      {showButton && (
        <button onClick={handleOpen} className="btn-primary inline-block">
          Get Started
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-3 sm:mx-4 p-0 relative overflow-hidden border border-primary-100">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary-600 transition-colors"
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
            <div className="pt-4 px-5 sm:px-6 text-center bg-gradient-to-b from-primary-50 to-white">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 22c0-3.866 4.477-7 9-7s9 3.134 9 7"
                    />
                  </svg>
                </div>
                <div className="text-lg font-bold text-primary-900">
                  Candidate Placement Details
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 pt-3">
              <div className="h-1 bg-gradient-to-r from-primary-400 to-primary-700 rounded-full mb-4"></div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-lg mb-3 text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2.5 rounded-lg mb-3 text-sm font-medium">
                  {success}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-primary-900 text-sm font-semibold mb-1.5">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all ${
                      nameError
                        ? "focus:ring-2 border-red-400 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-primary-500"
                    }`}
                  />
                  {nameError && (
                    <p className="mt-1 text-xs text-red-600">{nameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-900 text-sm font-semibold mb-1.5">
                    Email ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all ${
                      emailError
                        ? "focus:ring-2 border-red-400 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-primary-500"
                    }`}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-600">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-900 text-sm font-semibold mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      if (mobileError) setMobileError("");
                    }}
                    className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all ${
                      mobileError
                        ? "focus:ring-2 border-red-400 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-primary-500"
                    }`}
                  />
                  {mobileError && (
                    <p className="mt-1 text-xs text-red-600">{mobileError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-900 text-sm font-semibold mb-1.5">
                    Preferred Technical Domain
                  </label>
                  <input
                    value={preferredTechnicalDomain}
                    onChange={(e) => {
                      setPreferredTechnicalDomain(e.target.value);
                      if (preferredTechnicalDomainError)
                        setPreferredTechnicalDomainError("");
                    }}
                    maxLength={100}
                    className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all ${
                      preferredTechnicalDomainError
                        ? "focus:ring-2 border-red-400 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-primary-500"
                    }`}
                  />
                  {preferredTechnicalDomainError && (
                    <p className="mt-1 text-xs text-red-600">
                      {preferredTechnicalDomainError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-900 text-sm font-semibold mb-1.5">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (stateError) setStateError("");
                    }}
                    className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all ${
                      stateError
                        ? "focus:ring-2 border-red-400 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-primary-500"
                    }`}
                  >
                    {states.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {stateError && (
                    <p className="mt-1 text-xs text-red-600">{stateError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-primary-900 text-sm font-semibold mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => {
                      setExperience(e.target.value);
                      setYearsError("");
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all focus:ring-2 focus:ring-primary-500"
                  >
                    {levels.length ? (
                      levels.map((l) => (
                        <option key={l.key} value={l.key}>
                          {l.label}
                        </option>
                      ))
                    ) : (
                      <>
                        <option key="FRESHER" value="FRESHER">
                          Fresher
                        </option>
                        <option key="EXPERIENCED" value="EXPERIENCED">
                          Experienced
                        </option>
                      </>
                    )}
                  </select>
                </div>

                {experience === "EXPERIENCED" && (
                  <div>
                    <label className="block text-primary-900 text-sm font-semibold mb-1.5">
                      Years of Experience
                    </label>
                    <select
                      value={years}
                      onChange={(e) => {
                        setYears(e.target.value);
                        if (yearsError) setYearsError("");
                      }}
                      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all ${
                        yearsError
                          ? "focus:ring-2 border-red-400 focus:ring-red-500"
                          : "focus:ring-2 focus:ring-primary-500"
                      }`}
                    >
                      {yearsOptions.length
                        ? yearsOptions.map((o) => (
                            <option key={o.key} value={o.key}>
                              {o.label}
                            </option>
                          ))
                        : Array.from({ length: 10 }, (_, i) =>
                            String(i + 1)
                          ).map((y) => (
                            <option key={y} value={y}>
                              {y === "10"
                                ? "10+ years"
                                : `${y} year${y > "1" ? "s" : ""}`}
                            </option>
                          ))}
                    </select>
                    {yearsError && (
                      <p className="mt-1 text-xs text-red-600">{yearsError}</p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      handleClose();
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-200 transition-all active:scale-[0.98] ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Sending..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
