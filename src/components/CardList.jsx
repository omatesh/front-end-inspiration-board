import PropTypes from 'prop-types';
import Card from './Card.jsx';
// import './CardList.css';

const CardList = ({ cards, deleteCard }) => {
  return (
    <ul className="cards__list no-bullet">
      {cards.map((card) => (
        <Card
          key={card.card_id}
          card_id={card.card_id}
          message={card.message}
          likes_count={card.likes_count}
          deleteCard={deleteCard}
        />
      ))}
    </ul>
  );
};

CardList.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      card_id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      likes_count: PropTypes.number.isRequired,
    })
  ).isRequired,
  deleteCard: PropTypes.func.isRequired,
};

export default CardList;