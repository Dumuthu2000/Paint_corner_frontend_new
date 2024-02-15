import './navbar.css'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useState, useEffect } from 'react';

const Navbar = (props) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const formatTime = (date) => {
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    return date.toLocaleTimeString(undefined, options);
  };

  return (
    <div className='navbarContainer'>
      <div className="Navbar">
        <div className="navTitle">{props.text}</div>
        <div className="profile">
          <p className='date'>Date: {formatDate(currentDateTime)}</p>
          <p className='time'>Time: {formatTime(currentDateTime)}</p>
          <p className='admin'>Admin</p>
          <AccountCircleOutlinedIcon style={{ fontSize: "40px", marginRight: "10px" }} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;

