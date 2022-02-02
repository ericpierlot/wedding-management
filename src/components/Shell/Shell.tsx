import {
  ActionIcon,
  Divider,
  Group,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { MdAssessment, MdGroups } from "react-icons/md";
import { useQuery, useQueryClient } from "react-query";
import { Link, Route, Routes } from "react-router-dom";
import Guests from "../../pages/Guests";
import Management, {
  Booking,
  fetchData,
} from "../../pages/Management/Management";
import Navigation from "../Navigation";
import ToggleScheme from "../ToggleScheme";

const NavigationApp = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        height: 80,
      }}
    >
      <Group>
        <Link
          style={{
            width: "100%",
            textAlign: "center",
            height: "100%",
            border: "none",
          }}
          to="/"
        >
          <ActionIcon
            color="red"
            variant="transparent"
            style={{ width: 80, height: 80 }}
          >
            <MdAssessment size={80} />
          </ActionIcon>
        </Link>
      </Group>

      <Divider orientation="vertical" />
      <Group>
        <Link
          style={{
            width: "100%",
            textAlign: "center",
            height: "100%",
            border: "none",
          }}
          to="/guests"
        >
          <ActionIcon
            color="red"
            variant="transparent"
            style={{ width: 80, height: 80 }}
          >
            <MdGroups size={80} />
          </ActionIcon>
        </Link>
      </Group>
    </nav>
  );
};

const HeaderApp = () => {
  const { data } = useQuery(["booking"], fetchData);
  const total = data?.reduce((acc, curr) => acc + curr.price, 0) ?? 0;
  const totalRemaining =
    data?.reduce((acc, curr) => acc + curr.deposit, 0) ?? 0;

  const theme = useMantineTheme();
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.red[6],
        padding: 12,
      }}
    >
      <Navigation />
      <div>
        <Text component="span" color="lime" weight="bold">
          ฿ {totalRemaining}
        </Text>{" "}
        /{" "}
        <Text
          component="span"
          weight="bold"
          color={theme.colorScheme === "dark" ? "red" : "dark"}
        >
          {total}
        </Text>
      </div>
      <ToggleScheme />
    </header>
  );
};
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Management />} />
      <Route path="/guests" element={<Guests />} />
    </Routes>
  );
};

const Shell = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <HeaderApp />
      <main style={{ flex: 1 }}>
        <Router />
      </main>
      {/* <header>
        <Divider orientation="horizontal" />
        <NavigationApp />
      </header> */}
    </div>
  );
};

export default Shell;
