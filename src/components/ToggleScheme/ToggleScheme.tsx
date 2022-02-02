import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { RiMoonClearLine, RiSunLine } from "react-icons/ri";

const ToggleScheme = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "red" : "dark"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? (
        <RiSunLine style={{ width: 18, height: 18 }} />
      ) : (
        <RiMoonClearLine style={{ width: 18, height: 18 }} />
      )}
    </ActionIcon>
  );
};

export default ToggleScheme;
