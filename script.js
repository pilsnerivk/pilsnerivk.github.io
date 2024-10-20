const size = 4;  // ������ ����� (4x4)
let grid = [];  // ��������� ������ ��� �������� ��������� �������� ����
let score = 0;  // ���� ������
let gameWon = false;  // ����, �����������, ������� �� �����

window.onload = function() {
    initGame();  // ������������� ���� ��� �������� ��������
    document.addEventListener('keydown', handleKey);  // ��������� ������� ������
    document.getElementById('new-game').addEventListener('click', initGame);  // ��������� ����� �� ������ "����� ����"
};

// ������������� ����: �������� ����� ����� � ���������� ������ ���� ������
function initGame() {
    grid = Array(size).fill().map(() => Array(size).fill(0));  // �������� ������ �����
    score = 0;  // ����� �����
    gameWon = false;  // ����� ����� ������
    addNewTile();  // ���������� ������ ������
    addNewTile();  // ���������� ������ ������
    updateGrid();  // ���������� ����������� �����
}

// ���������� ����� ������ �� ��������� ������ �����
function addNewTile() {
    let emptyCells = [];  // ������ ������ �����
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) {
                emptyCells.push({r, c});  // ���������� ������ ������
            }
        }
    }

    if (emptyCells.length > 0) {
        let {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;  // 90% ���� �� 2, 10% �� 4
    }
}

// ���������� ����������� ����� �� ��������
function updateGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';  // ������� ����������� �����������
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.value = grid[r][c];
            cell.textContent = grid[r][c] === 0 ? '' : grid[r][c];  // ����� ������, ���� �� �����
            container.appendChild(cell);
        }
    }
    document.getElementById('score').textContent = `����: ${score}`;  // ���������� �����
}

// ��������� ������� ������ �������
function handleKey(event) {
    let moved = false;
    switch(event.key) {
        case 'ArrowUp':
            moved = moveUp();  // �������� �����
            break;
        case 'ArrowDown':
            moved = moveDown();  // �������� ����
            break;
        case 'ArrowLeft':
            moved = moveLeft();  // �������� �����
            break;
        case 'ArrowRight':
            moved = moveRight();  // �������� ������
            break;
    }

    if (moved) {
        addNewTile();  // ���������� ����� ������, ���� ���� ��������
        updateGrid();  // ���������� �����

        // �������� ��������
        if (!gameWon && checkWin()) {
            alert('�����������! �� ��������!');  // ��������� � ������
            gameWon = true;  // ��������� ����� ������
        }

        // �������� ���������� ����
        if (checkGameOver()) {
            alert('���� ��������!');  // ��������� � ���������� ����
            initGame();  // ���������� ����
        }
    }
}

// ��������, ������ �� ����� ������ � ������ 2048
function checkWin() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 2048) {
                return true;  // ����� �������
            }
        }
    }
    return false;  // ����� �� ������ 2048
}

// �������� ���������� ���� (��� ��������� �����)
function checkGameOver() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) return false;  // ���� ���� ������ ������, ���� ������������
            if (c < size - 1 && grid[r][c] === grid[r][c + 1]) return false;  // ���� ����� ���������� ������ ������
            if (r < size - 1 && grid[r][c] === grid[r + 1][c]) return false;  // ���� ����� ���������� ������ �����
        }
    }
    return true;  // ���� ��������, ���� ��� ��������� �����
}

// �������� ������ �����
function moveUp() {
    let moved = false;
    for (let c = 0; c < size; c++) {
        let column = grid.map(row => row[c]);  // ��������� �������
        const original = [...column];  // ����� ������� ��� �������� ���������
        column = slide(column);  // ����� � ����������� ������
        moved = moved || original.some((val, idx) => val !== column[idx]);  // �������� ���������
        for (let r = 0; r < size; r++) {
            grid[r][c] = column[r];  // ���������� �������
        }
    }
    return moved;  // ����������, ���� �� ��������
}

// �������� ������ ����
function moveDown() {
    let moved = false;
    for (let c = 0; c < size; c++) {
        let column = grid.map(row => row[c]);  // ��������� �������
        const original = [...column];  // ����� ������� ��� �������� ���������
        column = slide(column.reverse()).reverse();  // ����� � ����������� ������
        moved = moved || original.some((val, idx) => val !== column[idx]);  // �������� ���������
        for (let r = 0; r < size; r++) {
            grid[r][c] = column[r];  // ���������� �������
        }
    }
    return moved;  // ����������, ���� �� ��������
}

// �������� ������ �����
function moveLeft() {
    let moved = false;
    for (let r = 0; r < size; r++) {
        const original = [...grid[r]];  // ����� ������ ��� �������� ���������
        grid[r] = slide(grid[r]);  // ����� � ����������� ������
        moved = moved || original.some((val, idx) => val !== grid[r][idx]);  // �������� ���������
    }
    return moved;  // ����������, ���� �� ��������
}

// �������� ������ ������
function moveRight() {
    let moved = false;
    for (let r = 0; r < size; r++) {
        const original = [...grid[r]];  // ����� ������ ��� �������� ���������
        grid[r] = slide(grid[r].reverse()).reverse();  // ����� � ����������� ������
        moved = moved || original.some((val, idx) => val !== grid[r][idx]);  // �������� ���������
    }
    return moved;  // ����������, ���� �� ��������
}

// ����� � ����������� ������ � ����/�������
function slide(row) {
    row = row.filter(value => value !== 0);  // �������� ������ �����
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {  // ���� ��� ������ �����, ���������� ��
            row[i] *= 2;
            score += row[i];  // ��������� � �����
            row[i + 1] = 0;  // ����������� ������
        }
    }
    row = row.filter(value => value !== 0);  // �������� ����� ����������� ������ �����
    while (row.length < size) {
        row.push(0);  // ���������� ���������� ���� ������
    }
    return row;  // ���������� ����������� ���
}
