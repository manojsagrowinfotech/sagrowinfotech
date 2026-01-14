"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { studentApi, excelApi } from "@/lib/api";
import UpdateProfileModal from "@/components/UpdateProfileModal";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'candidates' | 'excel'
  const [chartMonth, setChartMonth] = useState(() => new Date().getMonth() + 1);
  const [chartYear, setChartYear] = useState(() => new Date().getFullYear());
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [experienceChart, setExperienceChart] = useState([]);
  const [stateChart, setStateChart] = useState([]);
  const [chartSegment, setChartSegment] = useState("experience");
  const [theme, setTheme] = useState("light");
  const [chartSize, setChartSize] = useState(240);
  const chartRef = useRef(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [filters, setFilters] = useState({
    emailId: "",
    mobileNo: "",
    fromDate: "",
    toDate: "",
    sortBy: "createdTime",
    order: "ASC",
    page: 1,
    limit: 10,
  });
  
  // Separate state for Excel export dates to avoid conflict with table filters if needed,
  // or we can reuse filters.fromDate/toDate if that's the desired behavior.
  // For better UX, let's keep them synced or separate? 
  // If I go to Excel tab, I expect to download. 
  // Let's reuse filters for simplicity as it was before, but maybe user wants to filter table without downloading.
  // I'll keep reusing filters for now to minimize logic changes, but present them differently in Excel tab.
  
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const [stateFilter, setStateFilter] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setActiveTab("overview");
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
          mobileNo: filters.mobileNo,
          emailId: filters.emailId || null,
          fromDate: filters.fromDate || undefined,
          toDate: filters.toDate || undefined,
          sortBy: filters.sortBy,
          order: filters.order,
        };
        const response = await studentApi.getStudents(params);
        const {
          records = [],
          pagination: p = {
            totalRecords: 0,
            currentPage: 1,
            totalPages: 1,
            limit: filters.limit,
          },
        } = response.data || {};
        setStudents(records);
        setPagination(p);
      } catch (error) {
        console.error("Failed to fetch students", error);
        setStudents([]);
        setPagination({
          totalRecords: 0,
          currentPage: 1,
          totalPages: 1,
          limit: filters.limit,
        });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [user, filters]);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoadingChart(true);
      try {
        const start = new Date(chartYear, chartMonth - 1, 1);
        const end = new Date(chartYear, chartMonth, 0);
        const fromDate = start.toISOString().split("T")[0];
        const toDate = end.toISOString().split("T")[0];
        const res = await studentApi.getStudents({
          fromDate,
          toDate,
          page: 1,
          limit: 1000,
          sortBy: "createdTime",
          order: "ASC",
        });
        const records = res?.data?.records || [];
        const fresher = records.filter((r) => (r.experienceLevel || "").toUpperCase().startsWith("F")).length;
        const experienced = records.filter((r) => (r.experienceLevel || "").toUpperCase().startsWith("E")).length;
        const other = Math.max(0, records.length - fresher - experienced);
        setExperienceChart([
          { label: "Fresher", value: fresher },
          { label: "Experienced", value: experienced },
          ...(other > 0 ? [{ label: "Other/Unknown", value: other }] : []),
        ]);
        const states = records.reduce((acc, r) => {
          const st = r.state || "Unknown";
          acc[st] = (acc[st] || 0) + 1;
          return acc;
        }, {});
        const stateArr = Object.entries(states).map(([label, value]) => ({ label, value }));
        setStateChart(stateArr);
      } catch (e) {
        setExperienceChart([]);
        setStateChart([]);
      } finally {
        setIsLoadingChart(false);
      }
    };
    if (user) fetchChartData();
  }, [user, chartMonth, chartYear]);
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const initial = saved === "dark" ? "dark" : "light";
    setTheme(initial);
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", next);
  };
  useEffect(() => {
    const el = chartRef.current;
    if (!el || !window.ResizeObserver) return;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setChartSize(Math.max(160, Math.min(360, w)));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const downloadExcel = async () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From date and To date");
      return;
    }
    try {
      const res = await excelApi.download({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${filters.fromDate}_${filters.toDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel download failed", err);
      alert("Excel download failed. Please ensure you are logged in.");
    }
  };

  const totalStudents = pagination.totalRecords || students.length;
  const fresherCount = students.filter((s) =>
    (s.experienceLevel || "").toLowerCase().startsWith("f")
  ).length;
  const experiencedCount = students.filter((s) =>
    (s.experienceLevel || "").toLowerCase().startsWith("e")
  ).length;
  const stateCounts = students.reduce((acc, s) => {
    const st = s.state;
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const applyFilters = () => {
    setIsLoadingStudents(true);
    setFilters({ ...filters, page: 1 });
    setStateFilter("");
  };

  const resetFilters = () => {
    setIsLoadingStudents(true);
    setFilters({
      emailId: "",
      mobileNo: "",
      fromDate: "",
      toDate: "",
      sortBy: "createdTime",
      order: "ASC",
      page: 1,
      limit: 10,
    });
    setStateFilter("");
  };

  const goToPage = (p) => {
    if (p < 1 || p > (pagination.totalPages || 1)) return;
    setIsLoadingStudents(true);
    setFilters({ ...filters, page: p });
  };

  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const openDelete = (student) => {
    setDeleteTarget(student);
    setIsDeleteOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await studentApi.deleteStudent(deleteTarget.id);
      setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setPagination((p) => ({
        ...p,
        totalRecords: Math.max(0, (p.totalRecords || 0) - 1),
      }));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete candidate. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    const onOpenUpdate = () => setIsUpdateProfileOpen(true);
    window.addEventListener("openUpdateProfile", onOpenUpdate);
    return () => {
      window.removeEventListener("openUpdateProfile", onOpenUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Redirecting to login...</div>
    </div>
  );
}

function PieChart({ data, size = 240, thickness = 28, trackColor = "#f3f4f6" }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} fill="none" stroke={trackColor} strokeWidth={thickness} />
          {data.map((d) => {
            const segment = total ? (d.value / total) * circumference : 0;
            const dasharray = `${segment} ${circumference - segment}`;
            const circle = (
              <circle
                key={d.label}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={dasharray}
                strokeDashoffset={-offset}
              />
            );
            offset += segment;
            return circle;
          })}
        </g>
      </svg>
    </div>
  );
}
function PieChartCut({ data, size = 240 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = size / 2;
  let angle = 0;
  const toXY = (a) => {
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    return [x, y];
  };
  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {data.map((d) => {
            const slice = total ? (d.value / total) * Math.PI * 2 : 0;
            const start = angle;
            const end = angle + slice;
            const large = slice > Math.PI ? 1 : 0;
            const [x1, y1] = toXY(start);
            const [x2, y2] = toXY(end);
            angle = end;
            const dPath = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
            return <path key={d.label} d={dPath} fill={d.color} />;
          })}
        </g>
      </svg>
    </div>
  );
}
  return (
    <div className="container-custom py-6 min-h-screen flex flex-col lg:flex-row gap-8 bg-gray-50/50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:sticky lg:top-24">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
            <div 
              className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4 cursor-pointer hover:bg-primary-200 transition-colors relative group shadow-inner"
              onClick={() => setIsUpdateProfileOpen(true)}
            >
              {user.fullName ? (
                 <span className="text-3xl font-bold">{user.fullName[0].toUpperCase()}</span>
              ) : (
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold uppercase tracking-wider">Edit</span>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl text-center mb-1">{user.fullName}</h3>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full font-medium uppercase tracking-wide mb-3">{user.role}</span>
            <button 
              onClick={() => setIsUpdateProfileOpen(true)}
              className="text-sm text-primary-600 font-semibold hover:text-primary-800 hover:underline transition-all"
            >
              Profile
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "overview" 
                  ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${activeTab === "overview" ? "bg-white text-indigo-600" : "bg-gray-100 group-hover:bg-white"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9 9 0 1020.945 13H11V3.055z" /></svg>
              </div>
              <span className="font-medium">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("candidates")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "candidates" 
                  ? "bg-primary-50 text-primary-700 font-semibold shadow-sm ring-1 ring-primary-100" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${activeTab === "candidates" ? "bg-white text-primary-600" : "bg-gray-100 group-hover:bg-white"}`}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <span className="font-medium">Candidates</span>
            </button>
            <button
              onClick={() => setActiveTab("excel")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "excel" 
                  ? "bg-green-50 text-green-700 font-semibold shadow-sm ring-1 ring-green-100" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${activeTab === "excel" ? "bg-white text-green-600" : "bg-gray-100 group-hover:bg-white"}`}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <span className="font-medium">Excel Report</span>
            </button>
          </nav>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-sm active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Monthly candidate distribution</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
                <select
                  value={chartMonth}
                  onChange={(e) => setChartMonth(Number(e.target.value))}
                  className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-gray-100"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString("en", { month: "long" })}
                    </option>
                  ))}
                </select>
                <select
                  value={chartYear}
                  onChange={(e) => setChartYear(Number(e.target.value))}
                  className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-gray-100"
                >
                  {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full sm:w-auto">
                    <button
                      onClick={() => setChartSegment("experience")}
                      className={`px-3 py-2 text-sm flex-1 ${chartSegment === "experience" ? "bg-primary-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
                    >
                      Experience
                    </button>
                    <button
                      onClick={() => setChartSegment("state")}
                      className={`px-3 py-2 text-sm flex-1 ${chartSegment === "state" ? "bg-primary-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
                    >
                      State
                    </button>
                  </div>
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm w-full sm:w-auto"
                  >
                    {theme === "dark" ? "Light" : "Dark"}
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              {isLoadingChart ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Loading chart data...</p>
                </div>
              ) : (() => {
                const dataset = chartSegment === "experience" ? experienceChart : stateChart;
                const total = dataset.reduce((sum, d) => sum + d.value, 0);
                return total === 0;
              })() ? (
                <div className="p-8 text-center text-gray-600 dark:text-gray-300">No data available for the selected month and year.</div>
              ) : (
                <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                  {(() => {
                    const isDark = theme === "dark";
                    const palette = {
                      experience: {
                        Fresher: isDark ? "#60a5fa" : "#2563eb",
                        Experienced: isDark ? "#34d399" : "#16a34a",
                        "Other/Unknown": isDark ? "#d1d5db" : "#6b7280",
                      },
                      states: isDark
                        ? ["#60a5fa","#34d399","#fbbf24","#f87171","#a78bfa","#67e8f9","#86efac","#c084fc","#fda4af","#2dd4bf"]
                        : ["#2563eb","#16a34a","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#22c55e","#a855f7","#fb7185","#14b8a6"],
                    };
                    const dataset = chartSegment === "experience" ? experienceChart : stateChart;
                    const colored = chartSegment === "experience"
                      ? dataset.map((d) => ({ ...d, color: palette.experience[d.label] }))
                      : dataset.map((d, i) => ({ ...d, color: palette.states[i % palette.states.length] }));
                    return (
                      <>
                        <div ref={chartRef} className="w-full">
                          <PieChartCut
                            data={colored}
                            size={chartSize}
                          />
                        </div>
                        <div className="w-full lg:flex-1 sm:max-h-64 sm:overflow-auto">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Legend</h3>
                          <ul className="space-y-2">
                            {colored.map((d) => (
                              <li key={d.label} className="flex items-center gap-3">
                                <span className="inline-block w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: d.color }}></span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{d.label}</span>
                                <span className="ml-auto text-gray-500 dark:text-gray-400">{d.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === "candidates" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Candidates Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage and view registered candidates</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500 font-medium mb-1">Total Candidates</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500 font-medium mb-1">Fresher</p>
                <p className="text-3xl font-bold text-primary-600">{fresherCount}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500 font-medium mb-1">Experienced</p>
                <p className="text-3xl font-bold text-blue-600">{experiencedCount}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500 font-medium mb-1">Active States</p>
                <p className="text-3xl font-bold text-purple-600">{Object.keys(stateCounts).length}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Email ID</label>
                  <input
                    type="email"
                    value={filters.emailId}
                    onChange={(e) => setFilters({ ...filters, emailId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                    placeholder="Search email..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Mobile Number</label>
                  <input
                    type="text"
                    value={filters.mobileNo}
                    onChange={(e) => setFilters({ ...filters, mobileNo: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                    placeholder="Search mobile..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">From Date</label>
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">To Date</label>
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-sm shadow-primary-200"
                  >
                    Apply
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              {/* State Filter Tags */}
              {Object.keys(stateCounts).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Filter by State</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stateCounts).map(([st, count]) => (
                      <button
                        key={st}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                          stateFilter === st 
                            ? "bg-primary-600 text-white shadow-md shadow-primary-200" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setStateFilter(stateFilter === st ? "" : st)}
                      >
                        {st} <span className={`ml-1 opacity-70 ${stateFilter === st ? "text-white" : "text-gray-500"}`}>({count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {isLoadingStudents ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-t-primary-600 mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading student information...</p>
                </div>
              ) : (
                <>
                  <div className="block md:hidden">
                    <ul className="divide-y divide-gray-200">
                      {(stateFilter ? students.filter((s) => s.state === stateFilter) : students).map((student) => (
                        <li key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="text-base font-bold text-gray-900">{student.name}</div>
                              <div className="mt-1 space-y-1">
                                <div className="text-sm text-gray-900 flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                  {student.mobileNo}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                  {student.emailId}
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">{student.state}</span>
                                {(student.experienceLevel || "").toLowerCase().startsWith("f") ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">Fresher</span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">Experienced {student.yearsOfExperience && `(${student.yearsOfExperience})`}</span>
                                )}
                                <span className="text-xs text-gray-600">{student.preferredTechnicalDomain || "-"}</span>
                              </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2">
                              {isAdmin && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); openDelete(student); }}
                                  className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                  title="Delete Candidate"
                                  aria-label="Delete Candidate"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
                                </button>
                              )}
                              <button
                                onClick={() => { setSelectedStudent(student); setIsDetailsOpen(true); }}
                                className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                      {(stateFilter ? students.filter((s) => s.state === stateFilter) : students).length === 0 && (
                        <li className="p-6 text-center text-gray-500">No Candidates found matching your criteria.</li>
                      )}
                    </ul>
                  </div>
                  <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">State</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Domain</th>
                          {isAdmin && (
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(stateFilter
                          ? students.filter((s) => s.state === stateFilter)
                          : students
                        ).length === 0 ? (
                          <tr>
                            <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                              No Candidates found matching your criteria.
                            </td>
                          </tr>
                        ) : (
                          (stateFilter
                            ? students.filter((s) => s.state === stateFilter)
                            : students
                          ).map((student) => (
                            <tr
                              key={student.id}
                              className="hover:bg-gray-50 transition-colors group cursor-pointer"
                              onClick={() => { setSelectedStudent(student); setIsDetailsOpen(true); }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">{student.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-900 flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    {student.mobileNo}
                                  </span>
                                  <span className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {student.emailId}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                                  {student.state}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {(student.experienceLevel || "").toLowerCase().startsWith("f") ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                      Fresher
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                                      Experienced {student.yearsOfExperience && `(${student.yearsOfExperience})`}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.preferredTechnicalDomain || "-"}
                              </td>
                              {isAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); openDelete(student); }}
                                    className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                    title="Delete Candidate"
                                    aria-label="Delete Candidate"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.page <= 1 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                  }`}
                  onClick={() => goToPage(filters.page - 1)}
                  disabled={filters.page <= 1}
                >
                  Previous
                </button>
                <div className="text-sm font-medium text-gray-600">
                  Page <span className="text-gray-900">{filters.page}</span> of <span className="text-gray-900">{pagination.totalPages || 1}</span>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.page >= (pagination.totalPages || 1)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                  }`}
                  onClick={() => goToPage(filters.page + 1)}
                  disabled={filters.page >= (pagination.totalPages || 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "excel" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Excel Report</h1>
                <p className="text-gray-500 mt-1">Download candidate data for offline analysis</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
               <div className="flex items-start gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-bold text-gray-900 mb-2">Export Candidate Records</h3>
                   <p className="text-gray-600 text-sm mb-6">Select a date range to download the candidate database. The exported file will contain all candidate details including contact information, experience level, and preferences.</p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">From Date</label>
                        <input
                          type="date"
                          value={filters.fromDate}
                          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">To Date</label>
                        <input
                          type="date"
                          value={filters.toDate}
                          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                        />
                      </div>
                   </div>

                   <button
                     onClick={downloadExcel}
                     className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-[0.98]"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     Download
                   </button>
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <UpdateProfileModal
        isOpen={isUpdateProfileOpen}
        onClose={() => setIsUpdateProfileOpen(false)}
      />
      {isDetailsOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsDetailsOpen(false)}></div>
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Candidate Details</h3>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  {selectedStudent.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">{selectedStudent.name}</div>
                  <div className="text-xs text-gray-500">{selectedStudent.preferredTechnicalDomain || "-"}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="text-sm text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {selectedStudent.mobileNo}
                </div>
                <div className="text-sm text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {selectedStudent.emailId}
                </div>
                <div className="text-sm text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {selectedStudent.state}
                </div>
                <div className="text-sm text-gray-900">
                  {(selectedStudent.experienceLevel || "").toLowerCase().startsWith("f") ? "Fresher" : `Experienced ${selectedStudent.yearsOfExperience ? `(${selectedStudent.yearsOfExperience})` : ""}`}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsDeleteOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this candidate? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
