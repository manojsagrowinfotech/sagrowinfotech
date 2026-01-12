"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { studentApi } from "@/lib/api";

export default function CreateStudentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [state, setState] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");

  const [states, setStates] = useState([]);
  const [levels, setLevels] = useState([]);
  const [yearsOptions, setYearsOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);
  const [successToast, setSuccessToast] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    emailId: "",
    mobileNo: "",
    state: "",
    experienceLevel: "",
    yearsOfExperience: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      setShowScrollUp(scrollTop > 300);
      setShowScrollDown(scrollTop + windowHeight < documentHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [s, l, y] = await Promise.all([
          studentApi.getStates(),
          studentApi.getExperienceLevels(),
          studentApi.getYearsOfExperience(),
        ]);

        setStates(s?.data?.states || []);
        setLevels(l?.data?.experienceLevels || []);
        setYearsOptions(y?.data?.yearsOfExperience || []);
      } catch (e) {
        console.error("Failed to load options", e);
      }
    }
    loadOptions();
  }, []);

  const validate = (field, value, currentExperienceLevel = experienceLevel) => {
    const errors = { ...fieldErrors };

    switch (field) {
      case "name":
        errors.name = value.trim() ? "" : "Name is required";
        break;

      case "emailId":
        if (!value.trim()) {
          errors.emailId = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.emailId = "Invalid email address";
        } else {
          errors.emailId = "";
        }
        break;

      case "mobileNo":
        if (!value) {
          errors.mobileNo = "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          errors.mobileNo = "Mobile number must be exactly 10 digits";
        } else {
          errors.mobileNo = "";
        }
        break;

      case "state":
        errors.state = value ? "" : "Please select a state";
        break;

      case "experienceLevel":
        errors.experienceLevel = value
          ? ""
          : "Please select an experience level";
        break;

      case "yearsOfExperience":
        if (currentExperienceLevel === "EXPERIENCED" && !value) {
          errors.yearsOfExperience = "Please select years of experience";
        } else {
          errors.yearsOfExperience = "";
        }
        break;

      default:
        break;
    }

    setFieldErrors(errors);
    return !errors[field];
  };

  const validateAll = () => {
    const experienceValid = validate("experienceLevel", experienceLevel);

    return (
      validate("name", name) &&
      validate("emailId", emailId) &&
      validate("mobileNo", mobileNo) &&
      validate("state", state) &&
      experienceValid &&
      (experienceLevel !== "EXPERIENCED" ||
        validate("yearsOfExperience", yearsOfExperience, experienceLevel))
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateAll()) return;

    setLoading(true);
    try {
      const payload = {
        name,
        emailId,
        mobileNo,
        state,
        experienceLevel,
      };

      if (experienceLevel === "EXPERIENCED") {
        payload.yearsOfExperience = yearsOfExperience;
      }

      await studentApi.createStudent(payload);
      setSuccess("Candidate submitted successfully.");
      setSuccessToast("Candidate registered successfully");
      setTimeout(() => setSuccessToast(""), 3000);
      setName("");
      setEmailId("");
      setMobileNo("");
      setState("");
      setExperienceLevel("");
      setYearsOfExperience("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  // Minimal success toast
  const Toast = ({ message }) => (
    <div className="fixed top-4 right-4 z-[200]">
      <div className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
        {message}
      </div>
    </div>
  );

  return (
    <div className="container-custom py-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {successToast && <Toast message={successToast} />}
      {/* Scroll Indicators */}
      {showScrollUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5 transform transition-transform group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-5 h-5 transform transition-transform group-hover:translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Candidate Placement Details
          </h1>
          <p className="text-gray-600">
            Fill in the information below to register a new candidate
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          {/* Status Messages */}
          <div className="px-6 pt-6 space-y-3">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm animate-fade-in">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm animate-fade-in">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{success}</span>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
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
                  <span className="font-medium">Submitting...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={(e) => validate("name", e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.name
                      ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  }`}
                  placeholder="Enter candidate's full name"
                />
                {fieldErrors.name && (
                  <p className="mt-2 text-xs text-red-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  onBlur={(e) => validate("emailId", e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.emailId
                      ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  }`}
                  placeholder="candidate@example.com"
                />
                {fieldErrors.emailId && (
                  <p className="mt-2 text-xs text-red-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.emailId}
                  </p>
                )}
              </div>

              {/* Mobile Number Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={mobileNo}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setMobileNo(value);
                      if (fieldErrors.mobileNo) {
                        validate("mobileNo", value);
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const digits = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setMobileNo(digits);
                    }}
                    onBlur={(e) => validate("mobileNo", e.target.value)}
                    placeholder="9876543210"
                    maxLength="10"
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.mobileNo
                        ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                  />
                </div>
                {fieldErrors.mobileNo && (
                  <p className="mt-2 text-xs text-red-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.mobileNo}
                  </p>
                )}
              </div>

              {/* State Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto p-1 custom-scrollbar">
                  {states.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => {
                        setState(s.key);
                        validate("state", s.key);
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                        state === s.key
                          ? "bg-primary-600 text-white border-primary-600 shadow-md transform scale-105"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {fieldErrors.state && (
                  <p className="mt-2 text-xs text-red-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.state}
                  </p>
                )}
              </div>

              {/* Experience Level Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {levels.map((l) => (
                    <button
                      key={l.key}
                      type="button"
                      onClick={() => {
                        setExperienceLevel(l.key);
                        validate("experienceLevel", l.key);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center space-y-2 ${
                        experienceLevel === l.key
                          ? "border-primary-600 bg-primary-50 text-primary-700 shadow-md"
                          : "border-gray-100 bg-white text-gray-600 hover:border-primary-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-semibold">{l.label}</span>
                    </button>
                  ))}
                </div>
                {fieldErrors.experienceLevel && (
                  <p className="mt-2 text-xs text-red-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.experienceLevel}
                  </p>
                )}
              </div>

              {/* Years of Experience Card */}
              {experienceLevel === "EXPERIENCED" && (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {yearsOptions.map((y) => (
                      <button
                        key={y.key}
                        type="button"
                        onClick={() => {
                          setYearsOfExperience(y.key);
                          validate("yearsOfExperience", y.key);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          yearsOfExperience === y.key
                            ? "bg-primary-600 text-white border-primary-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                        }`}
                      >
                        {y.label}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.yearsOfExperience && (
                    <p className="mt-2 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.yearsOfExperience}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="group relative px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 flex items-center">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg
                        className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
