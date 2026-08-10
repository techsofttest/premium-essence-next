"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

interface AuthContextType {
    customer: Customer | null;
    loading: boolean;
    refreshCustomer: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshCustomer = async () => {
        try {
            setCustomer(await api<Customer>("/me"));
        } catch {
            setCustomer(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void refreshCustomer(); }, []);

    const login = async (email: string, password: string) => {
        const result = await api<Customer>("/customer/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        setCustomer(result);
    };

    const logout = async () => {
        await api("/customer/logout", { method: "POST" });
        setCustomer(null);
    };

    return <AuthContext.Provider value={{ customer, loading, refreshCustomer, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
