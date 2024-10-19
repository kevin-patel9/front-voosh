import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserAuthContext } from '../App';
import { getCookie } from '../common/Apicall';

const Navbar = () => {
    const [refetch, setRefetch] = useState(false);
    const [ isLogged, setIsLogged ] = useState(getCookie("token"));
    const { isLoggedIn, setIsLoggedIn } = useContext(UserAuthContext);

    const deleteToken = () => {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setIsLogged("");
        setIsLoggedIn(false);
    };

    useEffect(() => {
      setIsLogged(getCookie("token"));
    },[isLoggedIn])

    const handleRefetch = () => {
        setRefetch(!refetch);
    }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4285F4' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Management
        </Typography>
        {!isLogged ? 
            <>
            <Button color="inherit" onClick={handleRefetch} component={Link} to="/">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
            :
            <Button onClick={() => {
                deleteToken();
                handleRefetch();
            }} color="inherit" component={Link} to="/">
                Logout
            </Button>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
