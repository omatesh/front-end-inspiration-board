import { useState } from 'react';
import PropTypes from 'prop-types';
// import './NewBoardForm.css';

const NewBoardForm = ({ onBoardSubmit }) => {
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleOwnerChange = (event) => {
    setOwner(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim() === '' || owner.trim() === '') {
      return; // Prevent submission if either field is empty
    }

    const newBoard = {
      title: title,
      owner: owner
    };

    onBoardSubmit(newBoard);
    setTitle('');
    setOwner('');
  };

  return (
    <form className="new-board-form" onSubmit={handleSubmit}>
      <label htmlFor="board-title">Board Title:</label>
      <input
        id="board-title"
        name="title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter board title"
      />

      <label htmlFor="board-owner">Board Owner:</label>
      <input
        id="board-owner"
        name="owner"
        type="text"
        value={owner}
        onChange={handleOwnerChange}
        placeholder="Enter owner name"
      />

      <button type="submit">Add Board</button>
    </form>
  );
};

NewBoardForm.propTypes = {
  onBoardSubmit: PropTypes.func.isRequired,
};

export default NewBoardForm;