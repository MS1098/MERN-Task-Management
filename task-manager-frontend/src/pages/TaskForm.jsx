import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function TaskForm(){
  const [form, setForm] = useState({ title:'', description:'', status:'pending' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(()=>{
    if(id){
      axios.get(`/tasks`, { params:{ page:1, limit:100 } })
        .then(res => {
          const t = res.data.tasks.find(x => x._id === id);
          if(t) setForm({ title:t.title, description:t.description, status:t.status });
        }).catch(err=>console.error(err));
    }
  },[id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(id){
        await axios.put(`/tasks/${id}`, form);
      } else {
        await axios.post('/tasks', form);
      }
      navigate('/');
    } catch(err){ alert(err.response?.data?.message || err.message); }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} p={3} boxShadow={3}>
        <Typography variant="h5">{id ? 'Edit Task' : 'Add Task'}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField required fullWidth name="title" label="Title" margin="normal" value={form.title} onChange={e => setForm({...form,title: e.target.value})}/>
          <TextField fullWidth multiline rows={4} name="description" label="Description" margin="normal" value={form.description} onChange={e => setForm({...form,description: e.target.value})}/>
          <TextField select name="status" label="Status" value={form.status} onChange={e => setForm({...form,status:e.target.value})} fullWidth margin="normal">
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={()=>navigate('/')}>Cancel</Button>
            <Button variant="contained" type="submit">Save</Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
