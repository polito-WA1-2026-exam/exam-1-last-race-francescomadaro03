import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center mt-5">
      <h2>404 - Pagina non trovata</h2>
      <Link to="/" className="btn btn-primary mt-3">Torna alla Home</Link>
    </div>
  );
};

export default NotFound;
