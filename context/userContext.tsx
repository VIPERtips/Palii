import { createContext, useContext, useState, ReactNode } from "react";

type UserType = any; // your user type here

const UserContext = createContext<{
  user: UserType | null;
  setUser: (u: UserType) => void;
}>({ user: null, setUser: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
