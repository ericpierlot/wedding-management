import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import ListOfGuests from "./Display";
import { GuestInterface } from "./Display/Item/Item";
import ModalAddGuest from "./ModalAddGuest";

export enum Admin {
  ERIC = "1dfd7890-9310-4dd1-8b54-561719ab2ddb",
  NATTANICHA = "e2782533-b91b-49dd-b297-242baca57c7d",
}

const getListOfGuests = async () => {
  const { data } = await supabase.from<GuestInterface>("Guest").select("*");
  if (data === null) return [];
  return data;
};

const Guests = () => {
  const modals = useModals();
  const { data } = useQuery(["guest"], getListOfGuests);

  const EricGuests = data?.filter(
    (guest) => guest.responsableid === Admin.ERIC
  );

  const NattanichaGuests = data?.filter(
    (guest) => guest.responsableid === Admin.NATTANICHA
  );

  const openAddGuestModal = () =>
    modals.openModal({
      key: "add-guest",
      title: `Add a guest`,
      children: <ModalAddGuest />,
      onClose: () => modals.closeModal("add-guest"),
    });

  return (
    <section
      style={{
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Button color="red" fullWidth onClick={openAddGuestModal}>
        Add a guest
      </Button>
      <Group direction="column" spacing={32} grow>
        <Group grow direction="column">
          <ListOfGuests
            key={Admin.NATTANICHA}
            responsable="Nattanicha"
            data={NattanichaGuests}
          />
        </Group>
        <Group grow direction="column">
          <ListOfGuests key={Admin.ERIC} responsable="Eric" data={EricGuests} />
        </Group>
      </Group>

      <Button fullWidth component={Link} to="/">
        Back
      </Button>
    </section>
  );
};

export default Guests;
