import { useState } from 'react'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';

function App() {
  const[emailContent, setEmailContent]=useState('');
  const[tone,setTone]=useState('');
  const[generatedReply,setGeneratedReply]=useState('');
  const[loading,setLoading]=useState('');
  const[error,setError]=useState('');

  const handleSubmit = async () =>{
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate',{
        emailContent,tone
      });

      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
    } catch (error) {
      setError('Failed to generate reply. Please Try Again')
      console.error(error)
    } finally {
      setLoading(false);
    }

  };

  return (
    <Container maxWidth='md' sx={{py:4}}>
      <Typography variant='h3' component='h1' gutterBottom>
        Smart Email Replier
      </Typography>
      
      <Box sx={{mx:3}}>
        <TextField fullWidth multiline rows={10} variant='outlined' label='Original Email Content' 
        value={emailContent || ''} onChange={(e)=> setEmailContent(e.target.value)} sx={{mb:2}}/>

        <FormControl fullWidth sx={{mb:2}}>
          <InputLabel>Select Tone of reply (Optional)</InputLabel>
          <Select value={tone || ''} label={'Select Tone of reply (Optional)'} onChange={(e)=>setTone(e.target.value)}>
            <MenuItem value=''>None</MenuItem>
            <MenuItem value='Formal'>Formal</MenuItem>
            <MenuItem value='Informal'>Informal</MenuItem>
            <MenuItem value='Friendly'>Friendly</MenuItem>
            <MenuItem value='Persuasive'>Persuasive</MenuItem>
            <MenuItem value='Apologetic'>Apologetic</MenuItem>
            <MenuItem value='Thankful'>Thankful</MenuItem>
            <MenuItem value='Direct'>Direct</MenuItem>
          </Select>
        </FormControl>

        <Button variant='contained' onClick={handleSubmit} disabled={!emailContent || loading} fullWidth>
          {loading ? <CircularProgress size={24}/> : "Generate Reply"}
        </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{mb:2}}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{mt:3}}>
          <Typography variant='h6' gutterBottom>
            Generated Reply of Email:
          </Typography>

          <TextField fullWidth multiline rows={8} variant='outlined' value={generatedReply || ''}
          inputProps={{readOnly:true}}/>

          <Button variant='outlined' sx={{mt:2}} onClick={()=> navigator.clipboard.writeText(generatedReply)}>
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default App
