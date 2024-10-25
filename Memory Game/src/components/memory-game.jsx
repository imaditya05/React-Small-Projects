import React, { useEffect, useState } from "react";

const Memorygame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  const handleInputChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 || size <= 10) {
      setGridSize(size);
    }
  };

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (disabled || won) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        //check match logic
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);

  const isSolved = (id) => solved.includes(id);

  const initializeCards = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [
      ...Array(pairCount)
        .keys()
        .map((num) => num + 1),
    ];

    const shuffleCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({
        id: index,
        number,
      }));

    setCards(shuffleCards);
    setFlipped([]);
    setWon(false);
    setSolved([]);
  };

  useEffect(() => {
    initializeCards();
  }, [gridSize]);

  useEffect(() => {
    if (solved.length === cards.length) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

      {/* Input */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          {" "}
          Grid Size : (max 10)
        </label>
        <input
          id="gridSize"
          type="number"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleInputChange}
          className="border-2 border-gray-300 px-2 py-1 rounded"
        />
      </div>

      {/* Game Board */}
      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex justify-center items-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {won && (
        <div className="text-4xl font-bold text-green-500 animate-bounce mt-4">
          You won
        </div>
      )}

      {/* Reset Button */}
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={initializeCards}
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default Memorygame;
