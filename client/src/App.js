import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {things: null};
  }

  render() {
    const { things } = this.state;
    if (!things) { return <div>loading...</div>; }

    return (
      <div className="App">
        {things.map((thing, i) => <li key={i}>{thing}</li>)}
      </div>
    );
  }

  componentDidMount () {
    axios.get('/api/things').then(res => {
      this.setState({things: res.data})
    });
  }
}

export default App;
