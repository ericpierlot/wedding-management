import { Menu, Divider, ThemeIcon } from "@mantine/core";
import { FiSettings, FiPieChart } from "react-icons/fi";
import { MdLogin, MdLogout } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { supabase } from "../../services/supabaseClient";
import { getUser } from "../../utils";

const Navigation = () => {
  const user = getUser();
  const navigate = useNavigate();
  async function signInWithGoogle() {
    const { user, session, error } = await supabase.auth.signIn({
      provider: "google",
    });
    console.log(user, session, error);
  }

  async function signout() {
    const { error } = await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <Menu
      control={
        <ThemeIcon color="red" variant="light">
          <GiHamburgerMenu />
        </ThemeIcon>
      }
    >
      <Menu.Item icon={<FiPieChart />} component={Link} to="/">
        Finance
      </Menu.Item>
      <Menu.Item icon={<IoIosPeople />} component={Link} to="/guests">
        Guests
      </Menu.Item>
      <Divider />
      <Menu.Label>
        {user ? `Welcome ${user.email}` : "Let's login !"}
      </Menu.Label>
      <Menu.Item icon={<FiSettings />}>Settings</Menu.Item>
      {!user?.id && (
        <Menu.Item color="green" icon={<MdLogin />} onClick={signInWithGoogle}>
          Login
        </Menu.Item>
      )}
      {user?.id && (
        <Menu.Item color="red" icon={<MdLogout />} onClick={signout}>
          Logout
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Navigation;
