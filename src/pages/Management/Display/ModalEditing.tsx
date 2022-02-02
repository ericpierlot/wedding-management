import { Group, NumberInput, TextInput, Button, Input } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../../services/supabaseClient";
import { uploadImageToSupabaseStorage } from "../../../utils";
import { removeAttachFileFromStorage } from "../Form/ManagementForm";
import { Booking } from "../Management";

export interface ModalEditingProps {
  id: number;
  value: string;
  price: number;
  deposit: number;
}

type BookingEditProps = Omit<Booking, "created_at">;
const supabaseEditBooking = async ({
  id,
  value,
  price,
  deposit,
  attachFile_url,
}: BookingEditProps) => {
  try {
    await supabase
      .from<Booking>("Booking")
      .update({ deposit, value, price, attachFile_url })
      .match({ id });
  } catch (error) {
    throw new Error("Error editing booking");
  }
};

const ModalEditing = ({ id, value, deposit, price }: ModalEditingProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    (editProps: BookingEditProps) => supabaseEditBooking({ ...editProps }),
    {
      mutationKey: ["booking", id],
      onSuccess: () => {
        queryClient.invalidateQueries(["booking"]);
      },
    }
  );

  const modals = useModals();
  const [editValue, setEditValue] = useState(value);
  const [editPrice, setEditPrice] = useState(price);
  const [editDeposit, setEditDeposit] = useState(deposit);
  const [remaining, setRemaining] = useState(editPrice - editDeposit);
  const [file, setFile] = useState<any>(null);

  const handleEditValue = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.currentTarget.value);
  };
  const handleEditPrice = (v: number) => {
    setEditPrice(v);
  };
  const handleEditDeposit = (v: number) => {
    if (v > editPrice) return;
    setEditDeposit(v);
  };

  const handleModify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let attachFile_url: string | null = null;
    if (file) {
      attachFile_url = await uploadImageToSupabaseStorage(
        formData.get("attachFile_url") as File
      );
    }

    await mutateAsync(
      {
        id,
        value: editValue,
        price: editPrice,
        deposit: editDeposit,
        attachFile_url,
      },
      {
        onSuccess: () => {
          modals.closeModal("edit-booking");
        },
        onError: (error) => {
          if (attachFile_url) {
            removeAttachFileFromStorage(attachFile_url);
          }
        },
      }
    );
  };

  useEffect(() => {
    setRemaining(editPrice - editDeposit);
  }, [editPrice, editDeposit]);

  const onChangeAttachFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    setFile(event.target.files[0]);
  };

  return (
    <form onSubmit={handleModify}>
      <Group spacing={32} direction="column" grow>
        <input type="number" name="id" defaultValue={id} hidden />
        <TextInput
          value={editValue}
          onChange={handleEditValue}
          label="Name"
          required
          name="name"
        />
        <NumberInput
          type="number"
          label="Price"
          required
          name="price"
          value={editPrice}
          onChange={handleEditPrice}
          icon="฿"
          step={100}
        />
        <NumberInput
          type="number"
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
        <Input
          type="file"
          id="attachFile"
          accept="image/*"
          name="attachFile_url"
          onChange={onChangeAttachFile}
        />
        <Group grow>
          <Button
            type="submit"
            color="red"
            variant="outline"
            onClick={() => modals.closeModal("edit-booking")}
          >
            Cancel
          </Button>
          <Button type="submit" color="red" loading={isLoading}>
            Save
          </Button>
        </Group>
      </Group>
    </form>
  );
};

export default ModalEditing;
