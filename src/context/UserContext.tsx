import { createContext, useState, ReactNode } from 'react';

// Cria o contexto
interface UserContextType {
  name: string;
  course: string;
  setUser: (user: { name: string; course: string }) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// Provedor do contexto
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({ name: '', course: '' });

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
