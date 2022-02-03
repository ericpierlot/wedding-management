import { Group, Paper, Text } from "@mantine/core";
import DeleteGuest from "./DeleteGuest";

export interface GuestInterface {
  id: number;
  lastname: string;
  firstname: string;
  responsableid: string;
}

const Guest = ({ id, lastname, firstname, responsableid }: GuestInterface) => {
  return (
    <Paper key={id} padding={12} shadow="xl" withBorder>
      <Group position="apart">
        <div>
          <Text component="span">{firstname}</Text>
          <Text component="span"> {lastname.charAt(0).toUpperCase()}.</Text>
          <Text component="span" hidden>
            {responsableid}
          </Text>
        </div>
        <div>
          <DeleteGuest id={id} />
        </div>
      </Group>
    </Paper>
  );
};

export default Guest;
