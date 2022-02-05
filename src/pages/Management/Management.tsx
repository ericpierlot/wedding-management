import { Group } from "@mantine/core";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useUser from "../../hooks/useUser";
import { supabase } from "../../services/supabaseClient";
import { fetchBookingOwner } from "../../utils";

import Display from "./Display";
import ManagementForm from "./Form";
import Search from "./Search";

export type Booking = {
  id: number;
  created_at: string;
  value: string;
  price: number;
  deposit: number;
  attachFile_url: string | null;
  ownerid: string;
};

// export const fetchData = async () => {
//   const { data } = await supabase
//     .from<Booking>("Booking")
//     .select("*")
//     .order("created_at");
//   if (data === null) return [];
//   return data;
// };

const Management = () => {
  const { user } = useUser();
  const { data } = useQuery(["booking", user && user.id], () =>
    fetchBookingOwner(user && user.id)
  );

  return (
    <Group grow spacing={32} direction="column">
      <ManagementForm />
      <Search data={data ?? []} />
      <Display data={data ?? []} />
    </Group>
  );
};

export default Management;
