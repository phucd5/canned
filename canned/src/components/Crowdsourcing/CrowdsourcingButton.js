import React from 'react';
import { uploadGarbageBin } from '../../scripts/database';
import LogoutButton from '../AccountPage/LogoutButton';

function CrowdsourcingButton() {
  const getLocation = async (binType) => {
    // Show confirmation dialog with the binType
    const isConfirmed = window.confirm(`Do you want to log your current location as a ${binType}?`);

    if (isConfirmed && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Call uploadGarbageBin with binType along with latitude and longitude
        try {
          await uploadGarbageBin(binType, latitude, longitude);
          alert(`${binType} location logged successfully.`);
        } catch (error) {
          console.error('Error uploading location:', error.message);
          alert(`Error uploading location: ${error.message}`);
        }
      }, (error) => {
        console.error('Error fetching location:', error.message);
        alert(`Error fetching location: ${error.message}`);
      });
    } else if (!isConfirmed) {
      console.log('Location logging cancelled by user.');
    } else {
      console.error('Geolocation is not supported by your browser.');
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div>
        <LogoutButton></LogoutButton>
      <button onClick={() => getLocation('Waste Bin')}>Log Waste Bin</button>
      <button onClick={() => getLocation('Recycle Bin')}>Log Recycle Bin</button>
    </div>
  );
}

export default CrowdsourcingButton;
