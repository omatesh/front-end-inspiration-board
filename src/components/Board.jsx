import PropTypes from 'prop-types';
import CardList from './CardList.jsx';
import NewCardForm from './NewCardForm.jsx';

const Board = ({ board, onAddCard, onDeleteCard, onDeleteBoard }) => {
  return (
    <div className="board">
      <h2>
        {board.title}
        {/* Delete button next to title */}
        <button
          onClick={() => onDeleteBoard(board.board_id)}
          aria-label={`Delete board ${board.title}`}
          style={{ marginLeft: '10px', cursor: 'pointer', color: 'red', border: 'none', background: 'transparent', fontSize: '1.2em' }}
          title="Delete board"
        >
          ×
        </button>
      </h2>
      <NewCardForm
        onCardAdd={(newCard) => onAddCard(board.board_id, newCard)}
        baseURL="http://127.0.0.1:5000"
      />
      <CardList cards={board.cards} deleteCard={onDeleteCard} />
    </div>
  );
};

Board.propTypes = {
  board: PropTypes.shape({
    board_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(
      PropTypes.shape({
        card_id: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        likes_count: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onAddCard: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
  onDeleteBoard: PropTypes.func.isRequired,
};

export default Board;