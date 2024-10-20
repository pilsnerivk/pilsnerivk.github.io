const size = 4;  // Размер сетки (4x4)
let grid = [];  // Двумерный массив для хранения состояния игрового поля
let score = 0;  // Счет игрока
let gameWon = false;  // Флаг, указывающий, выиграл ли игрок

window.onload = function() {
    initGame();  // Инициализация игры при загрузке страницы
    document.addEventListener('keydown', handleKey);  // Обработка нажатий клавиш
    document.getElementById('new-game').addEventListener('click', initGame);  // Обработка клика по кнопке "Новая игра"
};

// Инициализация игры: создание новой сетки и добавление первых двух плиток
function initGame() {
    grid = Array(size).fill().map(() => Array(size).fill(0));  // Создание пустой сетки
    score = 0;  // Сброс счета
    gameWon = false;  // Сброс флага победы
    addNewTile();  // Добавление первой плитки
    addNewTile();  // Добавление второй плитки
    updateGrid();  // Обновление отображения сетки
}

// Добавление новой плитки на случайное пустое место
function addNewTile() {
    let emptyCells = [];  // Массив пустых ячеек
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) {
                emptyCells.push({r, c});  // Добавление пустой ячейки
            }
        }
    }

    if (emptyCells.length > 0) {
        let {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;  // 90% шанс на 2, 10% на 4
    }
}

// Обновление отображения сетки на странице
function updateGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';  // Очистка предыдущего содержимого
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.value = grid[r][c];
            cell.textContent = grid[r][c] === 0 ? '' : grid[r][c];  // Показ плитки, если не пусто
            container.appendChild(cell);
        }
    }
    document.getElementById('score').textContent = `Счет: ${score}`;  // Обновление счета
}

// Обработка нажатий клавиш стрелок
function handleKey(event) {
    let moved = false;
    switch(event.key) {
        case 'ArrowUp':
            moved = moveUp();  // Движение вверх
            break;
        case 'ArrowDown':
            moved = moveDown();  // Движение вниз
            break;
        case 'ArrowLeft':
            moved = moveLeft();  // Движение влево
            break;
        case 'ArrowRight':
            moved = moveRight();  // Движение вправо
            break;
    }

    if (moved) {
        addNewTile();  // Добавление новой плитки, если было движение
        updateGrid();  // Обновление сетки

        // Проверка выигрыша
        if (!gameWon && checkWin()) {
            alert('Поздравляем! Вы выиграли!');  // Сообщение о победе
            gameWon = true;  // Установка флага победы
        }

        // Проверка завершения игры
        if (checkGameOver()) {
            alert('Игра окончена!');  // Сообщение о завершении игры
            initGame();  // Перезапуск игры
        }
    }
}

// Проверка, достиг ли игрок плитки с числом 2048
function checkWin() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 2048) {
                return true;  // Игрок победил
            }
        }
    }
    return false;  // Игрок не достиг 2048
}

// Проверка завершения игры (нет доступных ходов)
function checkGameOver() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) return false;  // Если есть пустая ячейка, игра продолжается
            if (c < size - 1 && grid[r][c] === grid[r][c + 1]) return false;  // Если можно объединить плитки справа
            if (r < size - 1 && grid[r][c] === grid[r + 1][c]) return false;  // Если можно объединить плитки снизу
        }
    }
    return true;  // Игра окончена, если нет доступных ходов
}

// Движение плиток вверх
function moveUp() {
    let moved = false;
    for (let c = 0; c < size; c++) {
        let column = grid.map(row => row[c]);  // Получение столбца
        const original = [...column];  // Копия столбца для проверки изменений
        column = slide(column);  // Сдвиг и объединение плиток
        moved = moved || original.some((val, idx) => val !== column[idx]);  // Проверка изменений
        for (let r = 0; r < size; r++) {
            grid[r][c] = column[r];  // Обновление столбца
        }
    }
    return moved;  // Возвращает, было ли движение
}

// Движение плиток вниз
function moveDown() {
    let moved = false;
    for (let c = 0; c < size; c++) {
        let column = grid.map(row => row[c]);  // Получение столбца
        const original = [...column];  // Копия столбца для проверки изменений
        column = slide(column.reverse()).reverse();  // Сдвиг и объединение плиток
        moved = moved || original.some((val, idx) => val !== column[idx]);  // Проверка изменений
        for (let r = 0; r < size; r++) {
            grid[r][c] = column[r];  // Обновление столбца
        }
    }
    return moved;  // Возвращает, было ли движение
}

// Движение плиток влево
function moveLeft() {
    let moved = false;
    for (let r = 0; r < size; r++) {
        const original = [...grid[r]];  // Копия строки для проверки изменений
        grid[r] = slide(grid[r]);  // Сдвиг и объединение плиток
        moved = moved || original.some((val, idx) => val !== grid[r][idx]);  // Проверка изменений
    }
    return moved;  // Возвращает, было ли движение
}

// Движение плиток вправо
function moveRight() {
    let moved = false;
    for (let r = 0; r < size; r++) {
        const original = [...grid[r]];  // Копия строки для проверки изменений
        grid[r] = slide(grid[r].reverse()).reverse();  // Сдвиг и объединение плиток
        moved = moved || original.some((val, idx) => val !== grid[r][idx]);  // Проверка изменений
    }
    return moved;  // Возвращает, было ли движение
}

// Сдвиг и объединение плиток в ряду/столбце
function slide(row) {
    row = row.filter(value => value !== 0);  // Удаление пустых ячеек
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {  // Если две плитки равны, объединяем их
            row[i] *= 2;
            score += row[i];  // Добавляем к счету
            row[i + 1] = 0;  // Освобождаем ячейку
        }
    }
    row = row.filter(value => value !== 0);  // Удаление вновь появившихся пустых ячеек
    while (row.length < size) {
        row.push(0);  // Заполнение оставшихся мест нулями
    }
    return row;  // Возвращает обновленный ряд
}
