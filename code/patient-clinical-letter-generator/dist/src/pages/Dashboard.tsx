import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List as MUIList,
  ListItemButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { 
  Description, 
  History, 
  Person, 
  Logout, 
  Add, 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const recentLetters = [
    { id: 1, patientName: 'John Smith', date: '2025-05-25', diagnosis: 'Hypertension' },
    { id: 2, patientName: 'Emily Johnson', date: '2025-05-23', diagnosis: 'Type 2 Diabetes' },
    { id: 3, patientName: 'Michael Brown', date: '2025-05-20', diagnosis: 'Asthma' },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        p: 2,
        backgroundColor: 'primary.main',
        color: 'white'
      }}>
        <Avatar 
          src="/images/profile_pic.jpg" 
          sx={{ 
            width: 80, 
            height: 80,
            mb: 2,
            border: '3px solid white'
          }} 
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Dr. Sarah Wilson
        </Typography>
        <Typography variant="body2">
          Cardiologist
        </Typography>
      </Box>
      <Divider />
      <MUIList>
        <ListItemButton selected>
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/input-form')}>
          <ListItemIcon>
            <Add color="primary" />
          </ListItemIcon>
          <ListItemText primary="New Letter" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <History color="primary" />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <Person color="primary" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <SettingsIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </MUIList>
      <Divider />
      <MUIList>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
        </ListItemButton>
      </MUIList>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Patient Clinical Letter Generator
          </Typography>
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help">
            <IconButton color="inherit">
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)'
          },
        }}
      >
        {drawer}
      </Drawer>
      
      <Main open={drawerOpen}>
        <Toolbar /> {/* Spacer for AppBar */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Welcome Card */}
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                  backgroundImage: 'linear-gradient(to right, #004953, #006064)',
                  color: 'white'
                }}
              >
                <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    Welcome back, Dr. Wilson
                  </Typography>
                  <Typography variant="body1">
                    You have generated 28 clinical letters this month.
                  </Typography>
                </Box>
                <ActionButton 
                  variant="contained" 
                  size="large"
                  startIcon={<Add />}
                  onClick={() => navigate('/input-form')}
                  sx={{ 
                    backgroundColor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  New Clinical Letter
                </ActionButton>
              </Paper>
            </Grid>
            
            {/* Quick Stats */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard elevation={0}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    28
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Letters This Month
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard elevation={0}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    142
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Letters
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard elevation={0}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    18
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Patients
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard elevation={0}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    85%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Time Saved
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            {/* Recent Letters */}
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: '16px',
                  height: '100%'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Recent Clinical Letters
                </Typography>
                <List>
                  {recentLetters.map((letter) => (
                    <React.Fragment key={letter.id}>
                      <ListItem 
                        sx={{ 
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)'
                          }
                        }}
                        secondaryAction={
                          <IconButton edge="end" aria-label="view">
                            <Description />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <Avatar sx={{ backgroundColor: 'primary.light' }}>
                            {letter.patientName.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={letter.patientName} 
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="text.primary">
                                {letter.diagnosis}
                              </Typography>
                              {` — ${new Date(letter.date).toLocaleDateString()}`}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button color="primary">View All Letters</Button>
                </Box>
              </Paper>
            </Grid>
            
            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: '16px',
                  height: '100%'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <ActionButton 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    startIcon={<Add />}
                    onClick={() => navigate('/input-form')}
                  >
                    New Clinical Letter
                  </ActionButton>
                  <ActionButton 
                    variant="outlined" 
                    color="primary" 
                    fullWidth 
                    startIcon={<History />}
                  >
                    View Letter History
                  </ActionButton>
                  <ActionButton 
                    variant="outlined" 
                    color="primary" 
                    fullWidth 
                    startIcon={<Person />}
                  >
                    Manage Patient Records
                  </ActionButton>
                  <ActionButton 
                    variant="outlined" 
                    color="primary" 
                    fullWidth 
                    startIcon={<SettingsIcon />}
                  >
                    Account Settings
                  </ActionButton>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Patient Clinical Letter Generator | University of Peradeniya
            </Typography>
          </Box>
        </Container>
      </Main>
    </Box>
  );
};

export default Dashboard;
