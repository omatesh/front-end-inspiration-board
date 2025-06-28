import { useState } from 'react';
import PropTypes from 'prop-types';
// import './NewCardForm.css';

const NewCardForm = ({ onCardAdd }) => {
  const [formFields, setFormFields] = useState({
    message: '',
    likes_count: '',
  });

  const handleChange = (event) => {
    setFormFields({
      ...formFields,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCard = {
      message: formFields.message || '',
      likes_count: parseInt(formFields.likes_count) || 0,
    };
    onCardAdd(newCard);
    setFormFields({ message: '', likes_count: '' });
  };

  return (
    <form className="new-card-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="message">Card Message:</label>
        <input
          id="message"
          name="message"
          value={formFields.message}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="likes_count">Likes Count:</label>
        <input
          id="likes_count"
          name="likes_count"
          type="number"
          value={formFields.likes_count}
          onChange={handleChange}
        />
      </div>
      <input type="submit" value="Add New Card" />
    </form>
  );
};

NewCardForm.propTypes = {
  onCardAdd: PropTypes.func.isRequired,
};

export default NewCardForm;