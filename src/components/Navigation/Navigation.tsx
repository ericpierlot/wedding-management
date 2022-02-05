import { Menu, Divider, ThemeIcon } from "@mantine/core";
import { FiSettings, FiPieChart } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { supabase } from "../../services/supabaseClient";
import useUser from "../../hooks/useUser";

const Navigation = () => {
  const { user } = useUser();

  async function signout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      throw new Error("Error signing out");
    }
  }

  return (
    <Menu
      control={
        <ThemeIcon color="red" variant="light">
          <GiHamburgerMenu />
        </ThemeIcon>
      }
    >
      <Menu.Item icon={<FiPieChart />} component={Link} to="/finance">
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
      {user && (
        <Menu.Item color="red" icon={<MdLogout />} onClick={signout}>
          Logout
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Navigation;
