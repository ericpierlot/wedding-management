import { useMantineTheme, Text } from "@mantine/core";
import { useQuery } from "react-query";
import { Route, Routes, useNavigate } from "react-router-dom";
import Guests from "../../pages/Guests/Guests";
import ManagementDetails from "../../pages/Management/Details";
import Management, { fetchData } from "../../pages/Management/Management";
import { formattedNumber, getLengthOfGuests } from "../../utils";
import Navigation from "../Navigation";
import ToggleScheme from "../ToggleScheme";

const HeaderApp = () => {
  const { data } = useQuery(["booking"], fetchData);
  const { data: nbGuests } = useQuery(["guests"], getLengthOfGuests);
  const navigate = useNavigate();
  const total = data?.reduce((acc, curr) => acc + curr.price, 0) ?? 0;
  const totalRemaining =
    data?.reduce((acc, curr) => acc + curr.deposit, 0) ?? 0;

  const theme = useMantineTheme();

  const navigateToGuests = () => navigate("/guests");

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
        height: 80,
        padding: "0 12px",
      }}
    >
      <Navigation />
      <Text
        color="teal"
        weight="bold"
        onClick={navigateToGuests}
        style={{ cursor: "pointer" }}
      >
        {nbGuests} {nbGuests && nbGuests > 1 ? "guests" : "guest"}
      </Text>
      <div>
        <Text component="div" color="green" weight="bold">
          {formattedNumber(totalRemaining)}
        </Text>
        <Text
          component="span"
          weight="bold"
          color={theme.colorScheme === "dark" ? "red" : "dark"}
        >
          {formattedNumber(total)}
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
      <Route path="/booking/:id" element={<ManagementDetails />} />
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
    </div>
  );
};

export default Shell;
