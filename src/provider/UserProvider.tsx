import { useEffect, useState } from "react";
import UserContext, { UserContextInterface } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserContextInterface | null>(null);

  useEffect(() => {
    const user = supabase.auth.user();

    if (user) {
      setUser({
        email: user.email,
        id: user.id,
      });
    }

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
