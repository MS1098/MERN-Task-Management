import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import { ColorModeContext } from './contexts/ThemeContext';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App(){
  const colorMode = useContext(ColorModeContext);
  const themeMode = localStorage.getItem('theme') || 'light';
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Task Manager</Typography>
          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Private><Dashboard /></Private>} />
        <Route path="/tasks/new" element={<Private><TaskForm /></Private>} />
        <Route path="/tasks/:id/edit" element={<Private><TaskForm /></Private>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

// simple private wrapper
function Private({ children }) {
  const token = localStorage.getItem('token');
  if(!token) return <Navigate to="/signin" />;
  return children;
}

export default App;
