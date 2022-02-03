import { Autocomplete, AutocompleteItem, Text } from "@mantine/core";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Booking } from "../Management";
import { useNavigate } from "react-router-dom";

const Search = ({ data }: { data: Booking[] }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const onSubmit = (item: AutocompleteItem) => {
    const { id } = item;
    navigate(`/booking/${id}`);
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
