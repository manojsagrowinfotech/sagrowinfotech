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
    const initAuth = async () => {
      const token = Cookies.get("accessToken");
      const emailId = Cookies.get("emailId");

      if (token) {
        // Set axios default header
        import("@/lib/api").then(({ default: api }) => {
          api.defaults.headers["Authorization"] = `Bearer ${token}`;
        });

        if (emailId) {
          try {
            const res = await userApi.getProfile(emailId);
            setUser(res.data);
          } catch (err) {
            console.error("Failed to load profile on refresh", err);
          }
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailId, password) => {
    const res = await authApi.login({ emailId, password });
    const { accessToken, refreshToken } = res.data;

    Cookies.set("accessToken", accessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", refreshToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("emailId", emailId, { secure: true, sameSite: "strict" });

    // Fetch profile
    const profileRes = await userApi.getProfile(emailId);
    setUser(profileRes.data);

    router.push("/dashboard");
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    router.push("/");
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
