import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../../../services/supabaseClient";
import { GuestInterface } from "./Item";
import { ActionIcon } from "@mantine/core";
import { MdClose } from "react-icons/md";

const deleteBookingId = async (id: number) => {
  try {
    await supabase.from<GuestInterface>("Guest").delete().match({ id });
  } catch (error) {
    throw new Error("Error removing guest");
  }
};

const DeleteGuest = ({ id }: Pick<GuestInterface, "id">) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(deleteBookingId, {
    mutationKey: ["guest", id],
    onSuccess: () => {
      queryClient.invalidateQueries(["guest"]);
    },
  });

  const deleteGuest = () => {
    mutateAsync(id);
  };

  return (
    <ActionIcon color="red" variant="light" onClick={deleteGuest}>
      <MdClose />
    </ActionIcon>
  );
};

export default DeleteGuest;
