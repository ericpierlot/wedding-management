import { Accordion, Group, Title } from "@mantine/core";
import Guest from "./Item";
import { GuestInterface } from "./Item/Item";

interface ListOfGuestsProps {
  responsable: string;
  data?: GuestInterface[];
}
const ListOfGuests = ({ data, responsable }: ListOfGuestsProps) => {
  if (!data) return null;

  return (
    <Accordion
      styles={{
        item: {
          borderBottom: 0,
        },
        contentInner: {
          paddingRight: 0,
          paddingLeft: 0,
        },
        content: {
          paddingLeft: 0,
        },
      }}
    >
      <Accordion.Item
        label={
          <Group position="apart">
            <Title order={4}>{responsable}'s Guests</Title>
            <span>({data.length})</span>
          </Group>
        }
      >
        <Group grow direction="column">
          {data?.map((guest: GuestInterface) => (
            <Guest
              key={guest.id}
              id={guest.id}
              firstname={guest.firstname}
              lastname={guest.lastname}
              responsableid={guest.responsableid}
            />
          ))}
        </Group>
      </Accordion.Item>
    </Accordion>
  );
};

export default ListOfGuests;
