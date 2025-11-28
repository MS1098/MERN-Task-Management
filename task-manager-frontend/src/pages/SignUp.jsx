import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import axios from '../api/axios';

export default function SignUp(){
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user' });
  const onChange = e => setForm({...form,[e.target.name]:e.target.value});

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch(err){ alert(err.response?.data?.message || err.message); }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} p={3} boxShadow={3}>
        <Typography variant="h5">Sign Up</Typography>
        <form onSubmit={submit}>
          <TextField required fullWidth name="name" label="Name" margin="normal" value={form.name} onChange={onChange}/>
          <TextField required fullWidth name="email" label="Email" margin="normal" value={form.email} onChange={onChange}/>
          <TextField required fullWidth name="password" label="Password" type="password" margin="normal" value={form.password} onChange={onChange}/>
          <Button variant="contained" type="submit" sx={{mt:2}}>Sign Up</Button>
        </form>
      </Box>
    </Container>
  );
}
