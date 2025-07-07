import { createContext, useState } from "react";
// 1. Tạo context:
export const AuthContext = createContext(null);
 // 2. Tạo provider: 1 cái wrapper cung cấp data xuống components con:
export const AuthProvider = ({children}) => {
    const userInfo = localStorage.getItem('userInfo');
    const [user, setUser] = useState(userInfo);

    const login = (user) => {
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null)
    }

    return (
        <AuthContext.Provider value = {{
            user,
            login,
            logout
        }}>
            {children}

        </AuthContext.Provider>
    )
}


