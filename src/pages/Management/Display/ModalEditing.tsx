import {
  Group,
  NumberInput,
  TextInput,
  Button,
  Notification,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FormEvent, useEffect, useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../../services/supabaseClient";
import { Booking } from "../Management";

export interface ModalEditingProps {
  id: number;
  value: string;
  price: number;
  deposit: number;
}

type BookingEditProps = Omit<Booking, "created_at" | "attachFile_url">;
const supabaseEditBooking = async ({
  id,
  value,
  price,
  deposit,
}: BookingEditProps) => {
  try {
    await supabase
      .from<Booking>("Booking")
      .update({ deposit, value, price })
      .match({ id });
  } catch (error) {
    throw new Error("Error editing booking");
  }
};

const deleteBookingId = async (id: number) => {
  try {
    await supabase.from<Booking>("Booking").delete().match({ id });
  } catch (error) {
    throw new Error("Error deleting booking");
  }
};

const ModalEditing = ({ id, value, deposit, price }: ModalEditingProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    (editProps: BookingEditProps) => supabaseEditBooking({ ...editProps }),
    {
      mutationKey: ["booking", id],
      onSuccess: () => {
        queryClient.invalidateQueries(["booking"]);
      },
    }
  );

  const { mutateAsync: deleteBooking } = useMutation(
    (idToDelete: number) => deleteBookingId(idToDelete),
    {
      mutationKey: ["booking", id],
      onSuccess: () => {
        queryClient.invalidateQueries(["booking"]);
      },
    }
  );
  const modals = useModals();
  const [editPrice, setEditPrice] = useState(price);
  const [editDeposit, setEditDeposit] = useState(deposit);
  const [remaining, setRemaining] = useState(editPrice - editDeposit);
  const [action, setAction] = useState<"Delete" | "Edit">();

  const handleEditPrice = (v: number) => {
    setEditPrice(v);
  };
  const handleEditDeposit = (v: number) => {
    if (v > editPrice) return;
    setEditDeposit(v);
  };

  const handleModify = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (action === "Delete") {
      deleteBooking(id, {
        onSuccess: () => {
          modals.closeModal("edit-booking");
        },
      });
    }

    if (action === "Edit") {
      const editValue = formData.get("name") as string;
      mutateAsync(
        {
          id,
          value: editValue,
          price: editPrice,
          deposit: editDeposit,
        },
        {
          onSuccess: () => {
            modals.closeModal("edit-booking");
          },
        }
      );
    }
  };

  useEffect(() => {
    setRemaining(editPrice - editDeposit);
  }, [editPrice, editDeposit]);

  return (
    <form onSubmit={handleModify}>
      <Group spacing={32} direction="column" grow>
        <NumberInput name="id" value={id} hidden />
        <TextInput defaultValue={value} label="Name" required name="name" />
        <NumberInput
          label="Price"
          required
          name="price"
          value={editPrice}
          onChange={handleEditPrice}
          icon="฿"
          step={100}
        />
        <NumberInput
          icon={<FaPiggyBank />}
          label="Deposit"
          name="deposit"
          value={editDeposit}
          onChange={handleEditDeposit}
          max={editPrice}
          min={0}
          step={100}
        />
        <NumberInput
          disabled
          label="Remaining"
          name="remaining"
          value={remaining}
          icon="฿"
          styles={{
            input: {
              color: "lime !important",
            },
          }}
        />
        <Group grow>
          <Button
            type="submit"
            color="red"
            variant="outline"
            onClick={() => setAction("Delete")}
          >
            Delete
          </Button>
          <Button type="submit" color="red" onClick={() => setAction("Edit")}>
            Edit
          </Button>
        </Group>
      </Group>
    </form>
  );
};

export default ModalEditing;
