import PropTypes from 'prop-types';
// import './Card.css';

const Card = ({ card_id, message, likes_count, deleteCard }) => {
  const deleteButtonClicked = () => {
    deleteCard(card_id);
  };

  return (
    <li className="cards__item">
      <p>{message}</p>
      <p>❤️ {likes_count}</p>
      <button className="cards__item__remove button" onClick={deleteButtonClicked}>
        x
      </button>
    </li>
  );
};

Card.propTypes = {
  card_id: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  likes_count: PropTypes.number.isRequired,
  deleteCard: PropTypes.func.isRequired,
};

export default Card;