import React from 'react';
import axios from 'axios';
import PersonForm from './PersonForm';

class PeopleEdit extends React.Component {
  constructor (props) {
    super(props);
    this.state = {name: null, quote: null, age: null, loading: true};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render () {
    const className = "PeopleEdit page";

    const { person, loading } = this.state;
    if (loading) {
      return <div className={className}>loading...</div>;
    }

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
    const { id } = this.props.match.params;
    const { name, age, quote } = this.state;
    axios.put(`/api/people/${id}`, { name, age, quote }).then(() => {
      this.props.history.push(`/people/${id}`);
    }).catch(e => {
      alert('oops! could not update');
    });
  }

  componentDidMount () {
    // props.match.params contains our url params (just like express!)
    const { id } = this.props.match.params;
    axios.get(`/api/people/${id}`).then(res => {
      const {name, age, quote} = res.data;
      this.setState({name, age, quote, loading: false});
    });
  }
}

export default PeopleEdit;
