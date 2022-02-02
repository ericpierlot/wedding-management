import { Menu, Divider, ThemeIcon } from "@mantine/core";
import { FiSettings, FiPieChart } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

const Navigation = () => {
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
      <Menu.Label>Application</Menu.Label>
      <Menu.Item icon={<FiSettings />}>Settings</Menu.Item>
      <Menu.Item color="red" icon={<MdLogout />}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default Navigation;
