import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class PeopleShow extends React.Component {
  constructor (props) {
    super(props);
    this.state = {person: null};
  }

  render () {
    const className = "PeopleShow page";

    const { person } = this.state;
    if (!person) {
      return <div className={className}>loading...</div>;
    }

    return (
      <div className={className}>
        <h4>{person.name}</h4>
        <p>{person.quote}</p>
        <br />

        <button onClick={() => this.handleDelete()}>Delete person</button>

        <br/>

        <Link to={`/people/${person.id}/edit`}> Edit </Link>
      </div>
    );
  }

  handleDelete () {
    const { match, history } = this.props;
    const { id } = match.params;
    axios.delete(`/api/people/${id}`).then(res => {
      history.push('/people'); // another way to redirect (props.history.push)
    });
  }

  componentDidMount () {
    // props.match.params contains our url params (just like express!)
    const { id } = this.props.match.params;
    axios.get(`/api/people/${id}`).then(res => {
      this.setState({person: res.data});
    });
  }
}

export default PeopleShow;
