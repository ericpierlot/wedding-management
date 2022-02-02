import { Group } from "@mantine/core";
import { useQuery } from "react-query";
import { supabase } from "../../services/supabaseClient";
import Display from "./Display";
import ManagementForm from "./Form";
import Search from "./Search";

export type Booking = {
  id: number;
  created_at: string;
  value: string;
  price: number;
  deposit: number;
  attachFile_url: string;
};

export const fetchData = async () => {
  const { data } = await supabase
    .from<Booking>("Booking")
    .select("*")
    .order("created_at");
  if (data === null) return [];
  return data;
};

const Management = () => {
  const { data } = useQuery(["booking"], fetchData);
  if (!data) return null;

  return (
    <Group grow spacing={32} direction="column">
      <ManagementForm />
      <Search data={data} />
      <Display data={data} />
    </Group>
  );
};

export default Management;
