import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import Shell from "../components/Shell";
import "./App.css";

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
        <QueryClientProvider client={queryClient}>
          <ModalsProvider>
            <Shell />
          </ModalsProvider>
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
