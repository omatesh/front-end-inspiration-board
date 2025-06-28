import { useEffect, useState } from 'react';
import axios from 'axios';
import CardList from './components/CardList.jsx';
import NewCardForm from './components/NewCardForm.jsx';
import NewBoardForm from './components/NewBoardForm.jsx';
import Board from './components/Board.jsx';
// import './App.css';


const App = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const baseURL = 'http://127.0.0.1:5000';

  // Fetch all boards on initial load
  // useEffect runs automatically once on component mount
  useEffect(() => {
    axios.get(`${baseURL}/boards`)
      .then((response) => {
        setBoards(response.data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(<p className="text_error">Error loading boards.</p>);
      });
  }, []);

// response object looks like this:
//   {
//   "data": { /* the actual data from the backend */ },
//   "status": 200,
//   "statusText": "OK",
//   "headers": { ... },
//   "config": { ... },
//   "request": { ... }
// }

// When a request fails, error might look like this:
// {
//   message: "Request failed with status code 404",
//   response: {
//     status: 404,
//     data: {
//       message: "Board not found"
//     },
//     headers: { ... },
//     config: { ... }
//   },
//   config: { ... },
//   code: "ERR_BAD_REQUEST",
//   isAxiosError: true,
//   toJSON: [Function]
// }


  // handles selecting a board from a list or UI
  // selectedBoard will now hold the new board object with cards
  const handleBoardSelect = (board) => {
    console.log("Fetching cards for board ID:", board.board_id);
    setErrorMessage('');
    // Fetch cards for this board:
    axios.get(`${baseURL}/boards/${board.board_id}/cards`)
      .then((response) => {
        // Updates the State with all the fresh Cards details just received from the backend
        setSelectedBoard(response.data);
        // Hides the Board_form
        setShowAddBoardForm(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(<p className="text_error">Error loading boards.</p>);
        setSelectedBoard(null);
      });
  };



 // NewBoardForm calls the addBoard function and passes a newBoard object
// when handleSubmit calls props.addBoard(newBoard)
  const addBoard = (newBoardData) => {
    setErrorMessage('');
    axios.post(`${baseURL}/boards`, newBoardData)
      .then((response) => {
        const newlyCreatedBoard = response.data.board;

    // Take the current boards array (prevBoards)
    // Put newlyCreatedBoard at the front
    // Keep the rest (...prevBoards)
        setBoards((prevBoards) => [newlyCreatedBoard, ...prevBoards]);
        setSelectedBoard(newlyCreatedBoard);
        setShowAddBoardForm(false);
      })
      .catch((error) => {
        console.error("Error creating board:", error);
        setErrorMessage(<p className="text_error">Error loading boards.</p>);
      });
  };


  // Add a new card to selected board
  // NewCardForm calls the addCard function and passes boardId and newCard 
  // when handleSubmit calls props.addCard(boardId, newCard)
  const addCard = (boardId, newCard) => {
    axios.post(`${baseURL}/boards/${boardId}/cards`, newCard)
      .then((response) => {
        // collects the new card
        // Aka { "card": { "id": 5, "message": "New idea 💡" } }
        const newCard = response.data.card;
        // when updating selectedBoard, gives me the current value first, 
        // so I can build a new version of it based on the latest state
        setSelectedBoard((prevBoard) => {
          // a safety check: if not prevBoard => return null
          if (!prevBoard) return null;
          return {
            //return A current board copy
            // ...Take the existing cards (or an empty array)
            // + Add the newCard to the end
            ...prevBoard,
            cards: [...(prevBoard.cards || []), newCard],
          };
        });
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(<p className="text_error">Error loading boards.</p>);
      });
  };

  // the updated selectedBoard to be:
//   {
//   id: 1,
//   title: "Inspiration Board",
//   cards: [
//     { id: 101, message: "You got this!" },
//     { id: 102, message: "Stay strong!" },
//     { id: 103, message: "New idea 💡" }  // <--- new card added!
//   ]
// }

  // Delete a selected board
  const deleteBoard = (boardId) => {
    // resets errorMessage
    setErrorMessage('');
    axios.delete(`${baseURL}/boards/${boardId}`)
      .then(() => {
         // Creates a new Board Objs array of boards by filtering out the board with the given boardId
        //  As a result, the new array has all boards EXCEPT the one with the matching boardId
        //prevBoards used as a current board
        setBoards((prevBoards) => prevBoards.filter((board) => board.board_id !== boardId));
        // checks if selectedBoard exists 
        if (selectedBoard && selectedBoard.board_id === boardId) {
          setSelectedBoard(null);
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(<p className="text_error">Error loading boards.</p>);
      });
  };


  // Delete a card from selected board
  const deleteCard = (cardId) => {
    setErrorMessage('');
    axios.delete(`${baseURL}/cards/${cardId}`)
      .then(() => {
        // Takes the existing array of cards from the previous board state (prevBoard.cards)
        setSelectedBoard((prevBoard) => {
          // a safety check: if not prevBoard => return null
          if (!prevBoard) return null;
          return {
            ...prevBoard,
            // use prevBoard.cards , if prevBoard.cards is null or undefined, use an empty array [] instead 
            // filter out card with id to be deleted 
            cards: (prevBoard.cards || []).filter((card) => card.card_id !== cardId),
          };
        });
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
        setErrorMessage(<p className="text_error">Error loading boards.</p>);
      });
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-inter p-6 flex flex-col items-center">
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Google Font - Inter */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
          .board-item {
            cursor: pointer;
            position: relative;
            min-height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .board-item:hover {
            transform: translateY(-3px);
          }
        `}
      </style>
      <h1 className="text-5xl font-extrabold text-purple-800 mb-8 drop-shadow-lg">Inspiration Board</h1>
      {errorMessage}

      <button
        onClick={() => setShowAddBoardForm(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 mb-8"
      >
        ➕ Add New Board
      </button>

      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Your Boards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showAddBoardForm && (
            <div className="board-item p-0 flex flex-col justify-stretch">
              <NewBoardForm onBoardSubmit={addBoard} />
            </div>
          )}
          {boards.length === 0 && !showAddBoardForm ? (
            <p className="text-gray-600 italic col-span-full text-center py-4">No boards available. Click "Add New Board" to create one!</p>
          ) : (
            boards.map((board) => {
              if (selectedBoard && selectedBoard.board_id === board.board_id) {
                return (
                  <Board
                    key={board.board_id}
                    board={selectedBoard}
                    onDeleteBoard={deleteBoard}
                    onAddCard={addCard}
                    onDeleteCard={deleteCard}
                  />
                );
              } else {
                return (
                  <div
                    key={board.board_id}
                    className={`board-item relative flex items-center justify-between p-4 rounded-lg shadow-md transition-all duration-200
                    ${selectedBoard && selectedBoard.board_id === board.board_id ? 'bg-purple-200 border-2 border-purple-500 scale-105' : 'bg-gray-50 hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex-grow cursor-pointer" onClick={() => handleBoardSelect(board)}>
                      <h3 className="text-lg font-semibold text-gray-800">{board.title}</h3>
                      <p className="text-sm text-gray-600">Owner: {board.owner}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBoard(board.board_id);
                      }}
                      aria-label={`Delete board ${board.title}`}
                      className="ml-4 text-red-500 hover:text-red-700 text-xl font-bold transition-colors focus:outline-none"
                      title="Delete board"
                    >
                      &times;
                    </button>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
