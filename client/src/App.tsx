import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-neon-red border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white">
      <Router>
        <Switch>
          <Route path="/" component={user ? Dashboard : LandingPage} />
          <Route path="/plans" component={Plans} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={() => <div className="text-center p-8">Página não encontrada</div>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;