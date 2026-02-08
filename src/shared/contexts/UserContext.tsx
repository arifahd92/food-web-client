import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Role = 'BUYER' | 'SELLER' | null;

interface UserContextType {
  role: Role;
  email: string | null;
  login: (role: Role, email: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('user_role') as Role;
    const storedEmail = localStorage.getItem('user_email');
    if (storedRole && storedEmail) {
      setRole(storedRole);
      setEmail(storedEmail);
    }
  }, []);

  const login = (newRole: Role, newEmail: string) => {
    localStorage.setItem('user_role', newRole as string);
    localStorage.setItem('user_email', newEmail);
    setRole(newRole);
    setEmail(newEmail);
  };

  const logout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    setRole(null);
    setEmail(null);
  };

  return (
    <UserContext.Provider value={{ role, email, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
