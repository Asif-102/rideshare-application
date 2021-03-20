import './App.css';
import Home from './components/Home/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import NavigationBar from './components/NavigationBar/NavigationBar';
import Destination from './components/Destination/Destination';
import Login from './components/Login/Login';
import NotFound from './components/NotFound/NotFound';
import { createContext, useState } from 'react';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

export const UserContext = createContext()

function App() {
  const [user, setUser] = useState({})
  return (
    <div className="App">
      <UserContext.Provider className="App" value={[user, setUser]}>
        <Router>
          <NavigationBar/>
          <Switch>
            <Route path="/home">
              <Home/>
            </Route>
            <PrivateRoute path="/destination/:vehicleId">
              <Destination/>
            </PrivateRoute>
            <Route path="/login">
              <Login/>
            </Route>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route path="*">
              <NotFound/>
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
