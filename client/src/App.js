import React, { Component } from 'react';
import './App.css';
import PeopleIndex from './PeopleIndex';
import PeopleShow from './PeopleShow';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path='/people' component={PeopleIndex} />
          <Route exact path='/people/:id' component={PeopleShow} />

          <br/>
          <Link to="/people"> All People </Link>
        </div>
      </Router>
    );
  }
}

export default App;
