import './App.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import RoutesApp from '../routes';
import logoPNG from "../assest/Logo Nome.png";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
      mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <header class="header">
        <div class="header__inner">
          <div class="header__logo">
            <a href="/">
              <img alt="JUST EAT" src={logoPNG} height="34" />
            </a>
          </div>
        </div>
      </header>
      <div className='content'>
        <RoutesApp />
      </div>
    </ThemeProvider>
  );
}

export default App;
