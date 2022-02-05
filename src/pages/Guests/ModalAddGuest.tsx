import { Button, Group, TextInput } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FormEvent } from "react";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../services/supabaseClient";
import { getUser } from "../../utils";
import { GuestInterface } from "./Display/Item/Item";
import { Admin } from "./Guests";

type AddGuestFields = Pick<
  GuestInterface,
  "firstname" | "lastname" | "responsableid"
>;

const supabasePostGuest = async (fields: AddGuestFields) => {
  await supabase.from("Guest").insert(fields);
};

const ModalAddGuest = () => {
  const user = getUser();

  const modals = useModals();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(supabasePostGuest, {
    mutationKey: ["guest"],
  });

  const handleAddGuest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      throw new Error("You aren't logged in");
    }
    if (user.id === Admin.NATTANICHA || user.id === Admin.ERIC) {
      const formData = new FormData(e.currentTarget);

      const fields = {
        firstname: formData.get("firstName") as string,
        lastname: formData.get("lastName") as string,
        responsableid: user.id,
      };

      try {
        await mutateAsync(fields, {
          onSuccess: () => {
            queryClient.invalidateQueries(["guest"]);
            modals.closeModal("add-guest");
          },
        });
      } catch (e) {
        throw new Error("Error while adding guest");
      }
    } else {
      throw new Error("You are not allowed to add guest");
    }
  };
  return (
    <form onSubmit={handleAddGuest}>
      <Group spacing={32} direction="column" grow>
        <TextInput label="Firstname" required name="firstName" />
        <TextInput label="Lastname" name="lastName" />
        <Group grow>
          <Button
            color="red"
            variant="outline"
            onClick={() => modals.closeModal("add-guest")}
          >
            Cancel
          </Button>
          <Button type="submit" color="red" loading={isLoading} fullWidth>
            Add
          </Button>
        </Group>
      </Group>
    </form>
  );
};

export default ModalAddGuest;
