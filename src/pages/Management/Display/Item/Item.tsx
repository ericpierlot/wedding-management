import { Paper, Group, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { formattedNumber } from "../../../../utils";
import { Booking } from "../../Management";
import { useStyles } from "./Item.style";

type BookingDisplay = Omit<Booking, "attachFile_url" | "created_at">;

const Item = ({ id, value, price, deposit }: BookingDisplay) => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const goToDetails = (bookingId: number) => {
    navigate(`/booking/${bookingId}`);
  };

  return (
    <Paper
      shadow="xl"
      padding={12}
      withBorder
      className={classes.main}
      //     onClick={() => onEdit({ id, value: name, price, deposit })}
      onClick={() => goToDetails(id)}
    >
      <Group direction="column" grow>
        <div style={{ fontWeight: "bold" }}>{value}</div>
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
            <Text>{formattedNumber(price)}</Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Text style={{ minWidth: 100 }}>Deposit</Text>
            <Text color="green">-{formattedNumber(deposit)}</Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Text style={{ minWidth: 100 }}>Remaining</Text>
            <Text color="red">+{formattedNumber(price - deposit)}</Text>
          </div>
        </div>
      </Group>
    </Paper>
  );
};

export default Item;
