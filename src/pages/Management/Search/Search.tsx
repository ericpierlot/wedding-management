import { Autocomplete, AutocompleteItem, Text } from "@mantine/core";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useModals } from "@mantine/modals";
import ModalEditing from "../Display/ModalEditing";
import { Booking } from "../Management";

const Search = ({ data }: { data: Booking[] }) => {
  const modals = useModals();
  const [search, setSearch] = useState("");

  const onSubmit = (item: AutocompleteItem) => {
    const { id, deposit, price, value } = item;

    modals.openModal({
      id: "edit-modal",
      children: (
        <ModalEditing id={id} deposit={deposit} value={value} price={price} />
      ),
      onClose: () => {
        setSearch("");
        modals.closeModal("edit-modal");
      },
    });
  };

  return (
    <Autocomplete
      data-autofocus={false}
      icon={<FaSearch />}
      placeholder="Search a name.."
      data={data}
      style={{ padding: 12 }}
      limit={4}
      onItemSubmit={onSubmit}
      onChange={(e) => setSearch(e)}
      value={search}
      nothingFound={<Text>Oopsie nothing found Darling !</Text>}
    />
  );
};

export default Search;
