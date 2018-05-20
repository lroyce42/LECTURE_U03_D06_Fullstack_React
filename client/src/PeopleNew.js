import React from 'react';
import axios from 'axios';
import PersonForm from './PersonForm';

class PeopleNew extends React.Component {
  constructor (props) {
    super(props);
    this.state = {name: '', quote: '', age: '', loading: true};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render () {
    const { name, age, quote } = this.state;

    return (
      <PersonForm person={{ name, age, quote }} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
    );
  }

  handleChange (e) {
    // https://reactjs.org/docs/forms.html#handling-multiple-inputs
    const {value, name} = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit () {
    const { name, age, quote } = this.state;
    axios.post(`/api/people`, { name, age, quote }).then(res => {
      const person = res.data;
      this.props.history.push(`/people/${person.id}`);
    });
  }
}

export default PeopleNew;
