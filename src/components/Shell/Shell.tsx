import { useMantineTheme, Text } from "@mantine/core";
import { useQuery } from "react-query";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import Guests from "../../pages/Guests/Guests";
import Home from "../../pages/Home";
import ManagementDetails from "../../pages/Management/Details";
import Management from "../../pages/Management/Management";
import {
  fetchBookingOwner,
  formattedNumber,
  getLengthOfGuests,
} from "../../utils";
import Navigation from "../Navigation";
import ToggleScheme from "../ToggleScheme";

const HeaderApp = () => {
  const { user } = useUser();
  const { data } = useQuery(["booking"], () =>
    fetchBookingOwner(user && user.id)
  );
  const { data: nbGuests } = useQuery(["guests"], getLengthOfGuests);
  const navigate = useNavigate();
  const total = data?.reduce((acc, curr) => acc + curr.price, 0) ?? 0;
  const totalDeposit = data?.reduce((acc, curr) => acc + curr.deposit, 0) ?? 0;

  const totalRemaining = total - totalDeposit;

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
        <Text
          component="span"
          weight="bold"
          color={theme.colorScheme === "dark" ? "red" : "dark"}
        >
          {formattedNumber(totalRemaining)}
        </Text>
      </div>
      <ToggleScheme />
    </header>
  );
};
const Router = () => {
  const { user } = useUser();
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate replace to="/finance" /> : <Home />}
      />
      {!user && <Route path="/" element={<Home />} />}
      {user && (
        <>
          <Route path="/finance" element={<Management />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/finance/:id" element={<ManagementDetails />} />
        </>
      )}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

const Shell = () => {
  const { user } = useUser();
  return (
    <div
      className="app"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {user && <HeaderApp />}
      <main style={{ flex: 1 }}>
        <Router />
      </main>
    </div>
  );
};

export default Shell;
