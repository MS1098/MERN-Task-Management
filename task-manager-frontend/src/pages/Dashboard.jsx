import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Container, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTasks = async (p=1) => {
    try {
      const res = await axios.get('/tasks', { params: { page: p, limit: 5 }});
      setTasks(res.data.tasks);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch(err){ alert(err.response?.data?.message || err.message); }
  };

  useEffect(()=>{ fetchTasks(); }, []);

  const deleteTask = async (id) => {
    if(!confirm('Delete task?')) return;
    try {
      await axios.delete(`/tasks/${id}`);
      fetchTasks(page);
    } catch(err){ alert(err.response?.data?.message || err.message); }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" onClick={()=>navigate('/tasks/new')}>Add Task</Button>
      </Box>

      <Box mt={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(t => (
              <TableRow key={t._id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={()=>navigate(`/tasks/${t._id}/edit`)}><EditIcon/></IconButton>

                  {/* show delete only for admin */}
                  {user?.role === 'admin' &&
                    <IconButton onClick={()=>deleteTask(t._id)}><DeleteIcon/></IconButton>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box my={2} display="flex" justifyContent="center">
        <Pagination count={totalPages} page={page} onChange={(e,val)=>fetchTasks(val)} />
      </Box>
    </Container>
  );
}
