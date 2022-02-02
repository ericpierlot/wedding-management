import { Box, Divider, Group, Text } from "@mantine/core";
import type { ModalEditingProps } from "../ModalEditing";
import { useStyles } from "./Item.style";

interface ItemProps {
  id: number;
  name: string;
  price: number;
  deposit: number;
  onEdit: (props: ModalEditingProps) => void;
}
const Item = ({ id, name, price, deposit, onEdit }: ItemProps) => {
  const { classes } = useStyles();

  return (
    <>
      <Box
        className={classes.main}
        onClick={() => onEdit({ id, value: name, price, deposit })}
      >
        <Group direction="column" grow>
          <div style={{ fontWeight: "bold" }}>{name}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Text style={{ minWidth: 100 }}>Total</Text>
              <Text>฿ {price}</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Text style={{ minWidth: 100 }}>Deposit</Text>
              <Text color="lime">-฿ {deposit}</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Text style={{ minWidth: 100 }}>Remaining</Text>
              <Text color="red">+฿ {price - deposit}</Text>
            </div>
          </div>
        </Group>
      </Box>
      <Divider />
    </>
  );
};

export default Item;
