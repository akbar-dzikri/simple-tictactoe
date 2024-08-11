const app = document.getElementById("app") as HTMLDivElement;

const pawn = {
  1: "X",
  2: "O",
};

let currentPlayer = 1; // (1 = Player, 2 = AI)
let board: string[] = Array(9).fill(""); // Inisialisasi board dengan nilai kosong

const startGame = () => {
  if (app) {
    const createBox = () => {
      const box = document.createElement("div");
      box.classList.add("box");
      box.addEventListener("click", handleBoxClick);
      app.append(box);
    };

    for (let i = 0; i < 9; i++) {
      createBox();
    }
  }
};

const handleBoxClick = (event: MouseEvent) => {
  const clickedBox = event.target as HTMLDivElement;
  const boxIndex = parseInt(clickedBox.dataset.index || "-1");

  // Cek jika masih ada box kosong
  if (boxIndex >= 0 && boxIndex < 9 && board[boxIndex] === "") {
    board[boxIndex] = pawn[currentPlayer];
    clickedBox.textContent = pawn[currentPlayer];

    // Delay 0.5 detik untuk mengecek pemenang dan giliran AI
    setTimeout(() => {
      winOrTie();
      currentPlayer = currentPlayer === 1 ? 2 : 1; // Ubah giliran
      // Panggil function giliran AI
      makeAIMove();
    }, 500);
  }
};

const makeAIMove = () => {
  // AI mengutamakan sudut board
  const corners = [0, 2, 6, 8];
  for (const corner of corners) {
    if (board[corner] === "") {
      board[corner] = pawn[currentPlayer]; // Pawn AI dari variable currentPlayer (1 = X, 2 = O)
      const cornerBox = document.querySelector(`[data-index="${corner}"]`);
      cornerBox!.textContent = pawn[currentPlayer];
      setTimeout(() => {
        winOrTie();
        currentPlayer = currentPlayer === 1 ? 2 : 1;
      }, 500);
      return;
    }
  }
  // Pilih kotak secara random bila tidak ada sudut
  const emptyCells: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      emptyCells.push(i);
    }
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const chosenIndex = emptyCells[randomIndex];
  board[chosenIndex] = pawn[currentPlayer];
  const aiBox = document.querySelector(`[data-index="${chosenIndex}"]`);
  aiBox!.textContent = pawn[currentPlayer];
  setTimeout(() => {
    winOrTie();
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  }, 500);
};

const checkForWinner = (): boolean => {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }

  return false;
};

const winOrTie = (): void => {
  if (checkForWinner()) {
    if (confirm(`${pawn[currentPlayer]} wins!`)) {
      window.location.reload();
    }
    return;
  } else if (isBoardFull()) {
    if (confirm(`Tie!`)) {
      window.location.reload();
    }
    return; // Game seri jika board sudah penuh
  }
};

const isBoardFull = (): boolean => {
  return board.every((cell) => cell !== "");
};

// Buat index setiap box untuk function handleBoxClick
startGame();
document.querySelectorAll(".box").forEach((box, index) => {
  box.dataset.index = index.toString();
});
