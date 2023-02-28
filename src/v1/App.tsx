import {ThemeProvider} from "grindery-ui";
import GrinderyNexusContextProvider from "use-grindery-nexus";
import HomePage from "./components/pages/HomePage";
import AppContextProvider from "./context/AppContext";
import {BrowserRouter as Router} from "react-router-dom";

function App() {
  return (
    <ThemeProvider>
      <GrinderyNexusContextProvider>
        <AppContextProvider>
          <Router>
            <HomePage />
          </Router>
        </AppContextProvider>
      </GrinderyNexusContextProvider>
    </ThemeProvider>
  );
}

export default App;
