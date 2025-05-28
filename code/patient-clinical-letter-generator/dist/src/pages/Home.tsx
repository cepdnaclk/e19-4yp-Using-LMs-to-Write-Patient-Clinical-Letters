import React from 'react';
import { Box, Button, Typography, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
}));

const HeroImage = styled(Box)({
  flex: '0 0 50%',
  backgroundImage: 'url("/images/FYP_Home.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
  },
});

const ContentSection = styled(Box)(({ theme }) => ({
  flex: '0 0 50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: '#f8f9fa',
}));

const AnimatedContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '600px',
  animation: 'fadeIn 1.2s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 4),
  borderRadius: '30px',
  fontWeight: 600,
  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  },
}));

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <HeroSection>
        <HeroImage />
        <ContentSection>
          <AnimatedContent>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                color: '#004953',
                mb: 3
              }}
            >
              Patient Clinical Letter Generator
            </Typography>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 400, 
                color: '#333',
                mb: 4,
                lineHeight: 1.5
              }}
            >
              Transforming patient care with precision and compassion through
              intelligent clinical letter generation
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <ActionButton 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={() => navigate('/login')}
              >
                Login
              </ActionButton>
              <ActionButton 
                variant="contained" 
                color="secondary" 
                size="large"
                onClick={() => navigate('/register')}
              >
                Register
              </ActionButton>
            </Box>
          </AnimatedContent>
        </ContentSection>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container>
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6, fontWeight: 600, color: '#004953' }}
          >
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'AI-Powered Generation',
                description: 'Leverage advanced language models to create accurate and personalized clinical letters.'
              },
              {
                title: 'Time Efficiency',
                description: 'Reduce documentation time by automating the letter generation process.'
              },
              {
                title: 'Enhanced Accuracy',
                description: 'Improve clarity and precision in patient communications.'
              },
              {
                title: 'Secure & Private',
                description: 'Built with data privacy and security as top priorities.'
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    border: '1px solid #eaeaea',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#004953' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, backgroundColor: '#004953', color: 'white' }}>
        <Container>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Patient Clinical Letter Generator | University of Peradeniya
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
