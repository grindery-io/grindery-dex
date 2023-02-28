import { ThemeProvider } from 'grindery-ui';
import GrinderyNexusContextProvider from 'use-grindery-nexus';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './context/AppContext';
import Header from './components/Header';

function App() {
  return (
    <ThemeProvider>
      <GrinderyNexusContextProvider>
        <AppContextProvider>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </AppContextProvider>
      </GrinderyNexusContextProvider>
    </ThemeProvider>
  );
}

export default App;
