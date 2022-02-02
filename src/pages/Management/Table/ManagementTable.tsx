import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  Table,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FormEvent, useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { MdCancel, MdCheck, MdDelete, MdEdit } from "react-icons/md";

const elements = [
  {
    id: 1,
    name: "Wedding place",
    price: 1000,
    deposit: 200,
    remaining: 800,
  },
  { id: 2, name: "Makeup", price: 50000, deposit: 40000, remaining: 10000 },
];

interface ModalEditingProps {
  id: number;
  name: string;
  price: number;
  deposit: number;
}

const ModalEditing = ({ id, name, deposit, price }: ModalEditingProps) => {
  const handleModify = (e: FormEvent) => {
    e.preventDefault();
    // TODO: API call to modify
    console.log("modify");
  };

  return (
    <form onSubmit={handleModify}>
      <Group spacing={32} direction="column" grow>
        <TextInput placeholder={name} label="Name" required name="name" />
        <NumberInput
          label="Price"
          required
          name="price"
          placeholder={price.toString()}
        />
        <NumberInput
          icon={<FaPiggyBank />}
          label="Deposit"
          name="deposit"
          placeholder={deposit.toString()}
        />
        <Button type="submit" color="red">
          Modify
        </Button>
      </Group>
    </form>
  );
};

const ManagementTable = () => {
  const modals = useModals();
  const [editing, setEditing] = useState<number | null>(null);
  const [opened, setOpened] = useState(false);

  const toggleEditing = (id: number) => {
    setEditing(id);
    setOpened(true);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const confirmEdit = (id: number) => {
    // TODO: Save changes
  };

  const onDelete = (id: number) => {
    // TODO: Delete element
  };

  const modalClose = () => {
    setOpened(false);
  };

  const ths = (
    <tr>
      <th>Name</th>
      <th>Price</th>
      <th>Deposit</th>

      <th></th>
    </tr>
  );

  const openContentModal = ({
    id,
    name,
    price,
    deposit,
  }: ModalEditingProps) => {
    const editModal = modals.openModal({
      title: `Editing ${name}`,
      children: (
        <>
          <ModalEditing id={id} deposit={deposit} name={name} price={price} />
        </>
      ),
      onClose: () => modals.closeModal(editModal),
    });
  };

  const rows = elements.map((element) => {
    const { id, name, price, deposit } = element;

    return (
      <tr key={element.id}>
        <td>{element.name}</td>
        <td>{element.price}</td>
        <td>{element.deposit}</td>
        <td>
          <Group noWrap>
            <ActionIcon onClick={() => onDelete(element.id)}>
              <ThemeIcon color="red" variant="light">
                <MdDelete />
              </ThemeIcon>
            </ActionIcon>
            <ActionIcon
              onClick={() => openContentModal({ id, name, price, deposit })}
            >
              <ThemeIcon color="grape" variant="light">
                <MdEdit />
              </ThemeIcon>
            </ActionIcon>
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <Table
      captionSide="bottom"
      verticalSpacing={16}
      highlightOnHover
      sx={(theme) => ({
        display: "table",
        "&> tbody tr:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? `${theme.colors.dark[8]} !important`
              : `${theme.colors.red[2]} !important`,
        },
      })}
    >
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ManagementTable;
