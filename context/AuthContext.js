"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { authApi, userApi } from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token and load user profile on mount
    const loadUser = async () => {
      const token = Cookies.get("accessToken");
      const emailId = Cookies.get("emailId");
      if (token) {
        try {
          if (!emailId) {
            setLoading(false);
            return;
          }
          const response = await userApi.getProfile(emailId);
          setUser(response.data);
        } catch (error) {
          console.error("Failed to load user profile", error);
          // If profile load fails (e.g., token invalid), logout
          // logout(); // Optional: might want to be less aggressive
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (emailId, password) => {
    try {
      const response = await authApi.login({ emailId, password });
      const { accessToken, refreshToken } = response.data;

      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("emailId", emailId, { secure: true, sameSite: "strict" });

      // Fetch user profile after successful login since it's not in the login response
      try {
        const profileResponse = await userApi.getProfile(emailId);
        setUser(profileResponse.data);
      } catch (profileError) {
        console.error("Failed to fetch user profile after login", profileError);
        // Fallback: set a minimal user object or handle error
        // setUser({ email: emailId });
      }

      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // await authApi.logout();
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("emailId");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUserProfile = async (data) => {
    try {
      const payload = {
        name: data?.name,
        mobile_no: data?.mobile_no,
        state: data?.state,
      };
      await userApi.updateProfile(payload);
      setUser({
        ...user,
        fullName: payload.name ?? user?.fullName,
        mobileNo: payload.mobile_no ?? user?.mobileNo,
        state: payload.state ?? user?.state,
      });
    } catch (error) {
      console.error("Update profile failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
