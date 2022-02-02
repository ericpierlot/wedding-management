import { Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import type { Booking } from "../Management";
import Item from "./Item";
import type { ModalEditingProps } from "./ModalEditing";
import ModalEditing from "./ModalEditing";

interface DisplayProps {
  data: Booking[];
}

const Display = ({ data }: DisplayProps) => {
  const modals = useModals();

  const modalEditContent = ({
    id,
    value: name,
    price,
    deposit,
  }: ModalEditingProps) => {
    const editModal = modals.openModal({
      key: "edit-booking",
      title: `Editing ${name}`,
      children: (
        <ModalEditing id={id} deposit={deposit} value={name} price={price} />
      ),
      onClose: () => modals.closeModal(editModal),
    });
  };

  return (
    <Group grow direction="column">
      {data.map(({ id, value: name, price, deposit }) => (
        <Item
          key={id}
          id={id}
          name={name}
          price={price}
          deposit={deposit}
          onEdit={() => modalEditContent({ id, value: name, price, deposit })}
        />
      ))}
    </Group>
  );
};

export default Display;
