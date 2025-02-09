import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    token: string | null;
    user: any | null;
    login: (token: string, userData: any) => void;
    logout: () => void;
    setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);

    console.log("token vừa chạy", token);
    useEffect(() => {
        localStorage.clear();

    }, []);

    const login = (newToken: string, userData: any) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('admin_token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
    };

    const handleSetToken = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem('admin_token', newToken);
        } else {
            localStorage.removeItem('admin_token');
        }
        setToken(newToken);
    };

    // Chỉ render khi đã load xong dữ liệu từ localStorage

    return (
        <AuthContext.Provider value={{ token, user, login, logout, setToken: handleSetToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
