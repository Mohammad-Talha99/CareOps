"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'OWNER' | 'STAFF';

interface User {
    name: string;
    role: Role;
    avatar?: string;
}

interface AuthContextType {
    user: User;
    switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>({
        name: 'Demo Owner',
        role: 'OWNER',
    });

    const switchRole = (role: Role) => {
        setUser({
            name: role === 'OWNER' ? 'Demo Owner' : 'Demo Staff',
            role: role,
        });
    };

    return (
        <AuthContext.Provider value={{ user, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
