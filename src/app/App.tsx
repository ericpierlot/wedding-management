import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import Shell from "../components/Shell";
import UserProvider from "../provider/UserProvider";

const queryClient = new QueryClient();

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, fontFamily: "Montserrat" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <ModalsProvider>
              <Shell />
            </ModalsProvider>
          </QueryClientProvider>
        </UserProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
