import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Link as MuiLink
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Download, ContentCopy, ArrowBack } from '@mui/icons-material';
import toast from 'react-hot-toast';

const FormContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
}));

const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: theme.spacing(1.2),
  borderRadius: '10px',
  fontWeight: 600,
  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  overflow: 'visible',
}));

const InputForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientDOB: null,
    diagnosis: '',
    symptoms: '',
    treatment: '',
    medications: '',
    followUp: '',
    additionalNotes: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      patientDOB: date
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
      toast.success('Clinical letter generated successfully!');
    }, 2000);
  };

  const handleDownload = () => {
    toast.success('Letter downloaded successfully!');
  };

  const handleCopy = () => {
    toast.success('Letter copied to clipboard!');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f7', pb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: 'primary.main', 
        color: 'white', 
        py: 2,
        px: 3,
        display: 'flex',
        alignItems: 'center'
      }}>
        <IconButton 
          color="inherit" 
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Generate Clinical Letter
        </Typography>
      </Box>
      
      <FormContainer maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormPaper elevation={0}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}
              >
                Patient Information
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormField
                      required
                      fullWidth
                      id="patientName"
                      name="patientName"
                      label="Patient Name"
                      value={formData.patientName}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormField
                      required
                      fullWidth
                      id="patientAge"
                      name="patientAge"
                      label="Age"
                      type="number"
                      value={formData.patientAge}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                        labelId="gender-label"
                        id="patientGender"
                        name="patientGender"
                        value={formData.patientGender}
                        label="Gender"
                        onChange={handleChange}
                        sx={{ borderRadius: '10px' }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ fontWeight: 600, color: 'primary.main', mt: 4, mb: 3 }}
                >
                  Medical Details
                </Typography>
                
                <FormField
                  required
                  fullWidth
                  id="diagnosis"
                  name="diagnosis"
                  label="Diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                />
                
                <FormField
                  required
                  fullWidth
                  id="symptoms"
                  name="symptoms"
                  label="Symptoms"
                  multiline
                  rows={3}
                  value={formData.symptoms}
                  onChange={handleChange}
                />
                
                <FormField
                  required
                  fullWidth
                  id="treatment"
                  name="treatment"
                  label="Treatment Plan"
                  multiline
                  rows={3}
                  value={formData.treatment}
                  onChange={handleChange}
                />
                
                <FormField
                  fullWidth
                  id="medications"
                  name="medications"
                  label="Medications"
                  multiline
                  rows={2}
                  value={formData.medications}
                  onChange={handleChange}
                />
                
                <FormField
                  fullWidth
                  id="followUp"
                  name="followUp"
                  label="Follow-up Instructions"
                  value={formData.followUp}
                  onChange={handleChange}
                />
                
                <FormField
                  fullWidth
                  id="additionalNotes"
                  name="additionalNotes"
                  label="Additional Notes"
                  multiline
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                />
                
                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generate Clinical Letter'}
                </SubmitButton>
              </Box>
            </FormPaper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {showResult ? (
              <ResultCard>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  p: 2,
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Generated Clinical Letter
                  </Typography>
                  <Box>
                    <Tooltip title="Copy to clipboard">
                      <IconButton color="inherit" onClick={handleCopy}>
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download as PDF">
                      <IconButton color="inherit" onClick={handleDownload}>
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px', 
                    p: 3,
                    backgroundColor: 'white',
                    minHeight: '600px'
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      CLINICAL LETTER
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Date: {new Date().toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body1" paragraph>
                      <strong>RE: {formData.patientName}</strong> | Age: {formData.patientAge} | Gender: {formData.patientGender}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      I am writing to provide a clinical summary for {formData.patientName}, who presented with {formData.symptoms}.
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      <strong>Diagnosis:</strong> {formData.diagnosis}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      <strong>Treatment Plan:</strong> {formData.treatment}
                    </Typography>
                    
                    {formData.medications && (
                      <Typography variant="body1" paragraph>
                        <strong>Medications:</strong> {formData.medications}
                      </Typography>
                    )}
                    
                    {formData.followUp && (
                      <Typography variant="body1" paragraph>
                        <strong>Follow-up Instructions:</strong> {formData.followUp}
                      </Typography>
                    )}
                    
                    {formData.additionalNotes && (
                      <Typography variant="body1" paragraph>
                        <strong>Additional Notes:</strong> {formData.additionalNotes}
                      </Typography>
                    )}
                    
                    <Typography variant="body1" paragraph sx={{ mt: 4 }}>
                      Please do not hesitate to contact me if you require any further information.
                    </Typography>
                    
                    <Typography variant="body1">
                      Yours sincerely,
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Dr. [Physician Name]
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      [Medical Specialty]
                    </Typography>
                  </Box>
                </CardContent>
              </ResultCard>
            ) : (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 4,
                backgroundColor: 'rgba(0, 73, 83, 0.05)',
                borderRadius: '16px',
                border: '2px dashed rgba(0, 73, 83, 0.2)'
              }}>
                <img 
                  src="/images/icons8-edit.gif" 
                  alt="Letter generation" 
                  style={{ width: '120px', marginBottom: '24px' }} 
                />
                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Your Clinical Letter Will Appear Here
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary">
                  Fill out the patient information and medical details form, then click "Generate Clinical Letter" to create a professional clinical letter.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
};

export default InputForm;
