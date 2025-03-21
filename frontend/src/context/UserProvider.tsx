import { createContext, useContext, useState, useEffect } from "react";
interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: {
    children: React.ReactNode;
}) => {
 const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
