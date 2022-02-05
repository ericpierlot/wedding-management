import { createContext } from "react";

export type UserContextInterface = {
  id: string;
  email?: string | null;
};

const UserContext = createContext<{
  user: UserContextInterface | null;
  setUser: (user: UserContextInterface | null) => void;
} | null>(null);

export default UserContext;
