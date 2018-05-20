import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class PeopleIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {people: null};
  }

  render() {
    const { people } = this.state;
    if (!people) { return <div>loading...</div>; }

    return (
      <div className="PeopleIndex">
        {people.map(person => this.renderPersonLink(person))}
      </div>
    );
  }

  renderPersonLink (person) {
    return (
      <li key={person.id}>
        <Link to={`/people/${person.id}`}>{person.name}</Link>
      </li>
    );
  }

  componentDidMount () {
    axios.get('/api/people').then(res => {
      this.setState({people: res.data})
    });
  }
}

export default PeopleIndex;
