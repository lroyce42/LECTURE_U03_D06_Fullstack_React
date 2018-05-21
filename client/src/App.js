import React, { Component } from 'react';
import './App.css';
import PeopleIndex from './PeopleIndex';
import PeopleShow from './PeopleShow';
import PeopleEdit from './PeopleEdit';
import PeopleNew from './PeopleNew';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path='/people' component={PeopleIndex} />
            <Route exact path='/people/new' component={PeopleNew} />
            <Route exact path='/people/:id' component={PeopleShow} />
            <Route exact path='/people/:id/edit' component={PeopleEdit} />
          </Switch>

          <br/>
          <NavLink exact to="/people">All People</NavLink>
          &nbsp; | &nbsp;
          <NavLink exact to="/people/new">New Person</NavLink>
        </div>
      </Router>
    );
  }
}

export default App;
