import React from 'react';


const PersonForm = (props) => {
  const { person, onSubmit, onChange } = props;
  const { name, age, quote } = person;

  return (
    <div className="PersonForm">
      Name: <input value={name} name="name" onChange={onChange}/>
      Age: <input value={age} name="age" type="number" onChange={onChange}/>
      Quote: <textarea value={quote} name="quote" onChange={onChange}/>
      <br/>
      <button onClick={onSubmit}>Submit!</button>
    </div>
  );
}

export default PersonForm;
