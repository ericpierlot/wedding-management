import {
  Box,
  Button,
  ScrollArea,
  Image,
  Paper,
  Text,
  Group,
  ActionIcon,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";
import { formattedNumber, usePermission } from "../../../utils";
import ModalEditing, { ModalEditingProps } from "../Display/ModalEditing";
import { removeAttachFileFromStorage } from "../Form/ManagementForm";
import { Booking } from "../Management";

const getBookingId = async (id: number | undefined) => {
  if (!id) return null;
  const { data } = await supabase
    .from<Booking>("Booking")
    .select("*")
    .match({ id });
  if (data === null) return null;
  return data[0];
};

const deleteBookingId = async (data: Booking) => {
  const { id, attachFile_url } = data;
  try {
    console.log("attachFile_url", attachFile_url);
    if (attachFile_url) {
      await removeAttachFileFromStorage(attachFile_url);
    }
    await supabase.from<Booking>("Booking").delete().match({ id });
  } catch (error) {
    throw new Error("Error deleting booking");
  }
};

async function downloadImage(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from("images")
      .download(path);

    if (error || data === null) {
      throw error;
    }
    return URL.createObjectURL(data);
  } catch (error: any) {
    throw new Error("Error downloading attachFile_url");
  }
}

const ManagementDetails = () => {
  const hasAccess = usePermission();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const modals = useModals();
  const { data } = useQuery(["booking", id], () => getBookingId(Number(id)));
  const navigate = useNavigate();
  const [urlFile, setUrlFile] = useState<string | undefined>("");
  const { mutateAsync: deleteBooking } = useMutation(
    (bookingToDelete: Booking) => deleteBookingId(bookingToDelete),
    {
      mutationKey: ["booking", id],
      onSuccess: async () => {
        queryClient.invalidateQueries(["booking"]);
      },
    }
  );

  useEffect(() => {
    if (data && data.attachFile_url) {
      downloadImage(data?.attachFile_url).then((url) => setUrlFile(url));
    }
  }, [data]);

  const openAttachFileModal = () => {
    const attachFileModal = modals.openModal({
      id: "attachFile",
      title: "Attach File",
      children: (
        <Box>
          <Image
            src={urlFile}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      ),
      onClose: () => modals.closeModal(attachFileModal),
    });
  };

  const openEditModal = ({ id, value, price, deposit }: ModalEditingProps) => {
    const editModal = modals.openModal({
      key: "edit-booking",
      title: `Editing ${value}`,
      children: (
        <ModalEditing id={id} deposit={deposit} value={value} price={price} />
      ),
      onClose: () => modals.closeModal(editModal),
    });
  };

  const handleDeleteBooking = async (booking: Booking | null | undefined) => {
    if (!booking) return;
    await deleteBooking(booking, {
      onSuccess: () => {
        modals.closeModal("delete-booking");
        navigate("/");
      },
    });
  };

  const handleOpenDeleteModal = () => {
    const deleteModal = modals.openModal({
      id: "delete-booking",
      title: `Delete ${data?.value}`,
      children: (
        <Group grow>
          <Text>Are you sure you want to delete this booking ?</Text>
          <Group grow>
            <Button
              color="red"
              variant="light"
              onClick={() => {
                modals.closeModal(deleteModal);
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => {
                handleDeleteBooking(data);
              }}
            >
              Delete
            </Button>
          </Group>
        </Group>
      ),
      onClose: () => modals.closeModal(deleteModal),
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 80px)",
        padding: 12,
      }}
    >
      <ScrollArea style={{ height: "calc(100vh - 140px)" }}>
        <Paper padding="md" shadow="xs" withBorder>
          <Group direction="column" grow>
            <Group position="apart">
              <Text>{data?.value}</Text>
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => data && handleOpenDeleteModal()}
                disabled={!hasAccess}
              >
                <MdDelete />
              </ActionIcon>
            </Group>

            <Text>{formattedNumber(data?.price ?? 0)}</Text>
            <Text>{formattedNumber(data?.deposit ?? 0)}</Text>
            {data?.attachFile_url && (
              <Button color="teal" onClick={openAttachFileModal}>
                See picture details
              </Button>
            )}
            <Button
              color="red"
              onClick={() => data && openEditModal({ ...data })}
              disabled={!hasAccess}
            >
              Edit
            </Button>
          </Group>
        </Paper>
      </ScrollArea>

      <Button onClick={() => navigate("/")} fullWidth>
        Back
      </Button>
    </div>
  );
};
export default ManagementDetails;
