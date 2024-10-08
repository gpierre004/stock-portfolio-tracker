import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import TransactionForm from './components/TransactionForm';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '2rem' }}>
        <h1>Stock Transaction Manager</h1>
        <TransactionForm />
      </div>
    </ThemeProvider>
  );
}

export default App;