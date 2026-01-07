'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { studentApi, excelApi } from '@/lib/api';
import UpdateProfileModal from '@/components/UpdateProfileModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';

// Mock Data for demonstration if API fails
const MOCK_STUDENTS = [
  { id: 1, name: 'Alice Johnson', mobile: '9876543210', email: 'alice@example.com', state: 'Karnataka', experience: '2 Years' },
  { id: 2, name: 'Bob Smith', mobile: '8765432109', email: 'bob@example.com', state: 'Maharashtra', experience: 'Fresher' },
  { id: 3, name: 'Charlie Brown', mobile: '7654321098', email: 'charlie@example.com', state: 'Tamil Nadu', experience: '1 Year' },
  { id: 4, name: 'David Lee', mobile: '6543210987', email: 'david@example.com', state: 'Telangana', experience: '3 Years' },
  { id: 5, name: 'Eve Wilson', mobile: '5432109876', email: 'eve@example.com', state: 'Delhi', experience: 'Fresher' },
];

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [filters, setFilters] = useState({
    emailId: '',
    mobileNo: '',
    fromDate: '',
    toDate: '',
    sortBy: 'createdTime',
    order: 'ASC',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({ totalRecords: 0, currentPage: 1, totalPages: 1, limit: 10 });
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

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
        const { records = [], pagination: p = { totalRecords: 0, currentPage: 1, totalPages: 1, limit: filters.limit } } = response.data || {};
        setStudents(records);
        setPagination(p);
      } catch (error) {
        console.error('Failed to fetch students', error);
        setStudents([]);
        setPagination({ totalRecords: 0, currentPage: 1, totalPages: 1, limit: filters.limit });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [user, filters]);

  const downloadExcel = async () => {
    if (!filters.fromDate || !filters.toDate) {
      alert('Please select From date and To date');
      return;
    }
    try {
      const res = await excelApi.download({ fromDate: filters.fromDate, toDate: filters.toDate });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_${filters.fromDate}_${filters.toDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Excel download failed', err);
      alert('Excel download failed. Please ensure you are logged in.');
    }
  };
  
  const totalStudents = pagination.totalRecords || students.length;
  const fresherCount = students.filter(s => (s.experienceLevel || '').toLowerCase().startsWith('f')).length;
  const experiencedCount = students.filter(s => (s.experienceLevel || '').toLowerCase().startsWith('e')).length;
  const stateCounts = students.reduce((acc, s) => {
    const st = s.state;
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});
  
  const applyFilters = () => {
    setIsLoadingStudents(true);
    setFilters({ ...filters, page: 1 });
    setStateFilter('');
  };
  
  const resetFilters = () => {
    setIsLoadingStudents(true);
    setFilters({
      emailId: '',
      mobileNo: '',
      fromDate: '',
      toDate: '',
      sortBy: 'createdTime',
      order: 'ASC',
      page: 1,
      limit: 10,
    });
    setStateFilter('');
  };
  
  const goToPage = (p) => {
    if (p < 1 || p > (pagination.totalPages || 1)) return;
    setIsLoadingStudents(true);
    setFilters({ ...filters, page: p });
  };
  
  useEffect(() => {
    const onOpenUpdate = () => setIsUpdateProfileOpen(true);
    const onOpenChange = () => setIsChangePasswordOpen(true);
    window.addEventListener('openUpdateProfile', onOpenUpdate);
    window.addEventListener('openChangePassword', onOpenChange);
    return () => {
      window.removeEventListener('openUpdateProfile', onOpenUpdate);
      window.removeEventListener('openChangePassword', onOpenChange);
    };
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, <span className="font-semibold text-primary-600">{user.fullName}</span></p>
        </div>
        <div className="flex gap-3">
          <button 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setIsUpdateProfileOpen(true)}
          >
            Update Profile
          </button>
           <button 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setIsChangePasswordOpen(true)}
          >
            Change Password
          </button>
          <button 
            onClick={downloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
        </div>
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-500">Fresher</p>
          <p className="text-2xl font-semibold text-gray-900">{fresherCount}</p>
        </div>
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-500">Experienced</p>
          <p className="text-2xl font-semibold text-gray-900">{experiencedCount}</p>
        </div>
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-500">States</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(stateCounts).map(([st, count]) => (
              <button
                key={st}
                className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded hover:bg-primary-100"
                onClick={() => setStateFilter(st)}
              >
                {st}: {count}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email ID</label>
            <input
              type="email"
              value={filters.emailId}
              onChange={(e) => setFilters({ ...filters, emailId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mobile number</label>
            <input
              type="text"
              value={filters.mobileNo}
              onChange={(e) => setFilters({ ...filters, mobileNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="9876543210"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">From date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-gray-900 font-medium">{user.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile No</p>
            <p className="text-gray-900 font-medium">{user.mobileNo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-gray-900 font-medium">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p className="text-gray-900 font-medium">{user.state}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
        </div>
        
        {isLoadingStudents ? (
           <div className="p-8 text-center">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
             <p className="mt-2 text-gray-500">Loading student data...</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(stateFilter ? students.filter(s => s.state === stateFilter) : students).map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.mobileNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.emailId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(student.experienceLevel || '').toLowerCase().startsWith('f')
                        ? 'Fresher'
                        : `Experienced${student.yearsOfExperience ? ` (${student.yearsOfExperience})` : ''}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <button
          className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          onClick={() => goToPage(filters.page - 1)}
          disabled={filters.page <= 1}
        >
          Previous
        </button>
        <div className="text-sm text-gray-700">
          Page {filters.page} of {pagination.totalPages || 1}
        </div>
        <button
          className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          onClick={() => goToPage(filters.page + 1)}
          disabled={filters.page >= (pagination.totalPages || 1)}
        >
          Next
        </button>
      </div>

      <UpdateProfileModal isOpen={isUpdateProfileOpen} onClose={() => setIsUpdateProfileOpen(false)} />
      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </div>
  );
}
