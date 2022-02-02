import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  main: {
    margin: "0 12px",
    "&:hover": {
      cursor: "pointer",
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },
  },
}));
