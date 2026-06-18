import React, { useContext } from 'react';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import TransitMap from './TransitMap';
import { getNetwork } from '../api';

const MapWrapper = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px' }}>
        <h2>Login to start playing</h2>
        <Link to="/login" className="btn btn-primary mt-3">
          Vai al Login
        </Link>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', minHeight: '600px' }}>
      <TransitMap fetchStations={getNetwork} />
    </div>
  );
};

export default MapWrapper;
