import {
  Button,
  Group,
  NumberInput,
  TextInput,
  Modal,
  Input,
} from "@mantine/core";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../../services/supabaseClient";
import { uploadImageToSupabaseStorage } from "../../../utils";
import { Booking } from "../Management";

type BookingPost = Omit<Booking, "created_at" | "id">;

const supabasePostBooking = async (fields: BookingPost) => {
  await supabase.from("Booking").insert(fields);
};

export const removeAttachFileFromStorage = async (path: string) => {
  await supabase.storage.from("images").remove([path]);
};

const ManagementForm = () => {
  const { mutateAsync, isLoading } = useMutation(supabasePostBooking, {
    mutationKey: ["booking"],
  });
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [deposit, setDeposit] = useState<number | undefined>(undefined);
  const [file, setFile] = useState<any>(null);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    let attachFile_url: string | null = null;
    if (file) {
      attachFile_url = await uploadImageToSupabaseStorage(
        formData.get("attachFile_url") as File
      );
    }

    const fields = {
      value: String(formData.get("value")),
      price: price ?? 0,
      deposit: deposit ?? 0,
      attachFile_url,
    };

    try {
      await mutateAsync(fields, {
        onSuccess: () => {
          queryClient.invalidateQueries(["booking"]);
          toggleCollapse();
        },
        onError: (error) => {
          if (attachFile_url) {
            removeAttachFileFromStorage(attachFile_url);
          }
        },
      });
    } catch (error: any) {
      if (attachFile_url) {
        await removeAttachFileFromStorage(attachFile_url);
      }
      throw new Error("Error adding");
    }
  };

  const onChangePrice = (value: number) => {
    setPrice(value);
  };

  const onChangeDeposit = (value: number) => {
    if (price === undefined) return;
    if (value > Number(price)) return;
    setDeposit(value);
  };

  const onChangeAttachFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    setFile(event.target.files[0]);
  };

  return (
    <div style={{ padding: 12 }}>
      <Button onClick={toggleCollapse} color="red" variant="filled" fullWidth>
        Add
      </Button>
      <Modal opened={collapsed} onClose={toggleCollapse} title="">
        <form onSubmit={onSubmit}>
          <Group spacing={32} direction="column" grow>
            <TextInput
              placeholder="Name"
              label="Name"
              required
              name="value"
              data-autofocus
            />
            <NumberInput
              type="number"
              label="Price"
              required
              name="price"
              icon="฿"
              value={price}
              onChange={onChangePrice}
              step={100}
              min={0}
            />
            <NumberInput
              type="number"
              icon={<FaPiggyBank />}
              label="Deposit"
              name="deposit"
              value={deposit}
              max={price}
              onChange={onChangeDeposit}
              min={0}
              step={100}
            />
            <Input
              type="file"
              id="attachFile"
              accept="image/*"
              name="attachFile_url"
              onChange={onChangeAttachFile}
            />

            <Button type="submit" color="red" loading={isLoading}>
              Add
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
};

export default ManagementForm;
