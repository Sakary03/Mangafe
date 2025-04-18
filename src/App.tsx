/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes'; // Import routes from routes/index.ts

const App: React.FC = () => {
  const renderRoutes = (routes: any) => {
    return routes.map((route: any, index: number) => (
      <Route
        key={index}
        path={route.path}
        element={route.element} // Use 'element' from route config
      >
        {route.children && renderRoutes(route.children)}{' '}
        {/* Render nested routes if they exist */}
      </Route>
    ));
  };

  return (
    <Router>
      <Routes>
        {renderRoutes(routes)} {/* Pass the routes to be rendered */}
      </Routes>
    </Router>
  );
};

export default App;
