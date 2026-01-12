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

  // 🔹 Load user on page refresh
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("accessToken");
      const emailId = Cookies.get("emailId");

      if (token) {
        // Set axios auth header
        const { default: api } = await import("@/lib/api");
        api.defaults.headers["Authorization"] = `Bearer ${token}`;

        if (emailId) {
          try {
            const res = await userApi.getProfile(emailId);
            setUser(res.data);
          } catch (error) {
            console.error("Failed to load user profile on refresh", error);
          }
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // 🔹 Login
  const login = async (emailId, password, skipRedirect = false) => {
    try {
      if (user) {
        throw new Error("User already logged in");
      }

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
      Cookies.set("emailId", emailId, {
        secure: true,
        sameSite: "strict",
      });

      // Fetch profile after login
      try {
        const profileResponse = await userApi.getProfile(emailId);
        setUser(profileResponse.data);
      } catch (error) {
        console.error("Failed to fetch profile after login", error);
      }

      if (!skipRedirect) {
        router.push("/dashboard");
      }

      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("emailId");
      setUser(null);
      router.push("/");
    }
  };

  // 🔹 Update profile
  const updateUserProfile = async (data) => {
    try {
      const payload = {
        name: data?.name,
        mobile_no: data?.mobile_no,
        state: data?.state,
      };

      await userApi.updateProfile(payload);

      setUser((prev) => ({
        ...prev,
        fullName: payload.name ?? prev?.fullName,
        mobileNo: payload.mobile_no ?? prev?.mobileNo,
        state: payload.state ?? prev?.state,
      }));
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
