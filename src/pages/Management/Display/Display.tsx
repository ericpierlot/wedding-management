import { Group } from "@mantine/core";
import type { Booking } from "../Management";
import Item from "./Item";

interface DisplayProps {
  data: Booking[];
}

const Display = ({ data }: DisplayProps) => {
  return (
    <Group grow direction="column" style={{ marginBottom: 32 }}>
      {data.map(({ id, value, price, deposit }) => (
        <Item key={id} id={id} value={value} price={price} deposit={deposit} />
      ))}
    </Group>
  );
};

export default Display;
