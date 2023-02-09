import React from "react";
import {ThemeProvider} from "grindery-ui";
import GrinderyNexusContextProvider from "use-grindery-nexus";
import HomePage from "./components/pages/HomePage";
import AppContextProvider from "./context/AppContext";

function App() {
  return (
    <ThemeProvider>
      <GrinderyNexusContextProvider>
        <AppContextProvider>
          <HomePage />
        </AppContextProvider>
      </GrinderyNexusContextProvider>
    </ThemeProvider>
  );
}

export default App;
