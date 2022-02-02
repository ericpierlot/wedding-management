import { Button, Group, NumberInput, TextInput, Modal } from "@mantine/core";
import { FormEvent, useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { supabase } from "../../../services/supabaseClient";

const ManagementForm = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [price, setPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fields = Object.fromEntries(formData);
    await supabase.from("Booking").insert(fields);
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
