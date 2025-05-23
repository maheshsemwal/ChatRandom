import { createContext, useContext, useState, useEffect } from "react";

interface UserType {
  userId: string;
  userName: string;
}

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
