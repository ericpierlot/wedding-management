import { Button, Group, NumberInput, TextInput, Modal } from "@mantine/core";
import { FormEvent, useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../../services/supabaseClient";
import { Booking } from "../Management";

type BookingPost = Omit<Booking, "created_at" | "id" | "attachFile_url">;

const supabasePostBooking = async (fields: BookingPost) => {
  await supabase.from("Booking").insert(fields);
};

const ManagementForm = () => {
  const { mutateAsync } = useMutation(supabasePostBooking, {
    mutationKey: ["booking"],
  });
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const [price, setPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fields = {
      value: formData.get("value") as string,
      price,
      deposit,
    };

    mutateAsync(fields, {
      onSuccess: () => {
        queryClient.invalidateQueries(["booking"]);
        toggleCollapse();
      },
    });
  };

  const onChangePrice = (value: number) => {
    setPrice(value);
  };

  const onChangeDeposit = (value: number) => {
    if (value > price) return;
    setDeposit(value);
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
              label="Price"
              required
              name="price"
              placeholder="0"
              value={price}
              onChange={onChangePrice}
            />
            <NumberInput
              icon={<FaPiggyBank />}
              label="Deposit"
              name="deposit"
              placeholder="0"
              value={deposit}
              max={price}
              onChange={onChangeDeposit}
            />
            <Button type="submit" color="red">
              Add
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
};

export default ManagementForm;
