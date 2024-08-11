var app = document.getElementById("app");
var pawn = {
    1: "X",
    2: "O",
};
var currentPlayer = 1; // (1 = Player, 2 = AI)
var board = Array(9).fill(""); // Inisialisasi board dengan nilai kosong
var startGame = function () {
    if (app) {
        var createBox = function () {
            var box = document.createElement("div");
            box.classList.add("box");
            box.addEventListener("click", handleBoxClick);
            app.append(box);
        };
        for (var i = 0; i < 9; i++) {
            createBox();
        }
    }
};
var handleBoxClick = function (event) {
    var clickedBox = event.target;
    var boxIndex = parseInt(clickedBox.dataset.index || "-1");
    // Cek jika masih ada box kosong
    if (boxIndex >= 0 && boxIndex < 9 && board[boxIndex] === "") {
        board[boxIndex] = pawn[currentPlayer];
        clickedBox.textContent = pawn[currentPlayer];
        // Delay 0.5 detik untuk mengecek pemenang dan giliran AI
        setTimeout(function () {
            winOrTie();
            currentPlayer = currentPlayer === 1 ? 2 : 1; // Ubah giliran
            // Panggil function giliran AI
            makeAIMove();
        }, 500);
    }
};
var makeAIMove = function () {
    // AI mengutamakan sudut board
    var corners = [0, 2, 6, 8];
    for (var _i = 0, corners_1 = corners; _i < corners_1.length; _i++) {
        var corner = corners_1[_i];
        if (board[corner] === "") {
            board[corner] = pawn[currentPlayer]; // Pawn AI dari variable currentPlayer (1 = X, 2 = O)
            var cornerBox = document.querySelector("[data-index=\"".concat(corner, "\"]"));
            cornerBox.textContent = pawn[currentPlayer];
            setTimeout(function () {
                winOrTie();
                currentPlayer = currentPlayer === 1 ? 2 : 1;
            }, 500);
            return;
        }
    }
    // Pilih kotak secara random bila tidak ada sudut
    var emptyCells = [];
    for (var i = 0; i < 9; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }
    var randomIndex = Math.floor(Math.random() * emptyCells.length);
    var chosenIndex = emptyCells[randomIndex];
    board[chosenIndex] = pawn[currentPlayer];
    var aiBox = document.querySelector("[data-index=\"".concat(chosenIndex, "\"]"));
    aiBox.textContent = pawn[currentPlayer];
    setTimeout(function () {
        winOrTie();
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }, 500);
};
var checkForWinner = function () {
    var winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (var _i = 0, winningLines_1 = winningLines; _i < winningLines_1.length; _i++) {
        var line = winningLines_1[_i];
        var a = line[0], b = line[1], c = line[2];
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
};
var winOrTie = function () {
    if (checkForWinner()) {
        if (confirm("".concat(pawn[currentPlayer], " wins!"))) {
            window.location.reload();
        }
        return;
    }
    else if (isBoardFull()) {
        if (confirm("Tie!")) {
            window.location.reload();
        }
        return; // Game seri jika board sudah penuh
    }
};
var isBoardFull = function () {
    return board.every(function (cell) { return cell !== ""; });
};
// Buat index setiap box untuk function handleBoxClick
startGame();
document.querySelectorAll(".box").forEach(function (box, index) {
    box.dataset.index = index.toString();
});
