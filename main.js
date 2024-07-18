document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.querySelector('.message');
    const resetButton = document.querySelector('.reset-button');
    const modeButtons = document.querySelectorAll('.mode-button');
    const board = document.querySelector('.board');
    const menu = document.querySelector('.menu');
    let isXNext = true;
    let gameActive = true;
    let againstAI = false;
    const boardState = Array(9).fill(null);

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const handleClick = (e) => {
        const cell = e.target;
        const cellIndex = cell.getAttribute('data-index');

        if (boardState[cellIndex] !== null || !gameActive) {
            return;
        }

        makeMove(cellIndex, isXNext ? 'X' : 'O');
        if (gameActive && againstAI && !isXNext) {
            setTimeout(aiMove, 500);
        }
    };

    const makeMove = (index, player) => {
        boardState[index] = player;
        cells[index].textContent = player;
        checkWinner(player);
        isXNext = !isXNext;
        if (gameActive) {
            message.textContent = isXNext ? "X's turn" : "O's turn";
        }
    };

    const checkWinner = (player) => {
        let roundWon = false;
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            message.textContent = `${player} wins!`;
            gameActive = false;
            return;
        }

        if (!boardState.includes(null)) {
            message.textContent = 'Game over! It\'s a draw!';
            gameActive = false;
        }
    };

    const resetGame = () => {
        isXNext = true;
        gameActive = true;
        boardState.fill(null);
        cells.forEach(cell => cell.textContent = '');
        message.textContent = "Select game mode";
        menu.style.display = 'block';
        board.style.display = 'none';
        resetButton.style.display = 'none';
    };

    const aiMove = () => {
        const bestMove = getBestMove(boardState, 'O');
        makeMove(bestMove.index, 'O');
    };

    const getBestMove = (board, player) => {
        const opponent = player === 'O' ? 'X' : 'O';

        const emptyCells = board
            .map((value, index) => (value === null ? index : null))
            .filter(value => value !== null);

        if (checkWin(board, 'O')) {
            return { score: 1 };
        } else if (checkWin(board, 'X')) {
            return { score: -1 };
        } else if (emptyCells.length === 0) {
            return { score: 0 };
        }

        const moves = [];

        for (let i = 0; i < emptyCells.length; i++) {
            const move = {};
            move.index = emptyCells[i];
            board[emptyCells[i]] = player;

            const result = getBestMove(board, opponent);
            move.score = result.score;

            board[emptyCells[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        }

        return bestMove;
    };

    const checkWin = (board, player) => {
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    };

    const selectMode = (e) => {
        const mode = e.target.getAttribute('data-mode');
        againstAI = mode === 'ai';
        menu.style.display = 'none';
        board.style.display = 'grid';
        resetButton.style.display = 'block';
        message.textContent = "X's turn";
    };

    modeButtons.forEach(button => button.addEventListener('click', selectMode));
    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetButton.addEventListener('click', resetGame);

    message.textContent = "Select game mode";
});
