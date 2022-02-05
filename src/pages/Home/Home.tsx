import { Button, Paper, Text } from "@mantine/core";
import { MdLock } from "react-icons/md";
import { supabase } from "../../services/supabaseClient";

const Home = () => {
  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signIn(
        {
          provider: "google",
        },
        {
          redirectTo: "http://localhost:3000/",
        }
      );
    } catch (e) {
      throw new Error("Error signing in");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        gap: 32,
      }}
    >
      <MdLock size={96} />

      <Paper shadow="xl" withBorder padding={12}>
        <Text>Login with Google Account</Text>
        <Button color="red" fullWidth onClick={signInWithGoogle}>
          Login
        </Button>
      </Paper>
    </div>
  );
};

export default Home;
