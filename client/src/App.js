import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {people: null};
  }

  render() {
    const { people } = this.state;
    if (!people) { return <div>loading...</div>; }

    return (
      <div className="App">
        {people.map((person, i) => <li key={i}>{person.name}</li>)}
      </div>
    );
  }

  componentDidMount () {
    axios.get('/api/people').then(res => {
      this.setState({people: res.data})
    });
  }
}

export default App;
