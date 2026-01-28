const grid = document.querySelector('.grid')
const result = document.getElementById('result')
const flagsLeftEl = document.getElementById('flagsLeft')

const width = 10
const bombAmount = 10

let squares = []
let flags = 0
let checkedValid = 0
let gameOver = false

flagsLeftEl.textContent = bombAmount

createBoard()

function createBoard() {
  const bombsArray = Array(bombAmount).fill('bomb')
  const emptyArray = Array(width * width - bombAmount).fill('valid')
  const gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5)

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    square.setAttribute('id', i)
    square.classList.add(gameArray[i])
    grid.appendChild(square)
    squares.push(square)

    square.addEventListener('click', () => click(square))
    square.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      addFlag(square)
    })
  }

  // add numbers (data attribute)
  for (let i = 0; i < squares.length; i++) {
    let total = 0
    const isLeftEdge = (i % width === 0)
    const isRightEdge = (i % width === width - 1)

    if (squares[i].classList.contains('valid')) {
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
      if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
      if (i > 10 && squares[i - width].classList.contains('bomb')) total++
      if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
      if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
      if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
      if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
      if (i < 89 && squares[i + width].classList.contains('bomb')) total++

      squares[i].setAttribute('data', total)
    }
  }
}

function click(square) {
  if (gameOver) return
  if (square.classList.contains('checked')) return

  if (square.classList.contains('bomb')) {
    revealBombs()
    result.textContent = 'YOU LOSE!'
    gameOver = true
    return
  }

  checkSquare(square)
  checkWin()
}

function checkSquare(square) {
  if (square.classList.contains('checked')) return

  square.classList.add('checked')
  if (square.classList.contains('flag')) {
    square.classList.remove('flag')
    flags--
    flagsLeftEl.textContent = bombAmount - flags
  }

  checkedValid++

  const total = square.getAttribute('data')
  if (total != 0) {
    square.textContent = total
    return
  }

  const currentId = parseInt(square.id)
  const isLeftEdge = (currentId % width === 0)
  const isRightEdge = (currentId % width === width - 1)

  setTimeout(() => {
    if (currentId > 0 && !isLeftEdge) click(squares[currentId - 1])
    if (currentId > 9 && !isRightEdge) click(squares[currentId + 1 - width])
    if (currentId > 10) click(squares[currentId - width])
    if (currentId > 11 && !isLeftEdge) click(squares[currentId - 1 - width])
    if (currentId < 98 && !isRightEdge) click(squares[currentId + 1])
    if (currentId < 90 && !isLeftEdge) click(squares[currentId - 1 + width])
    if (currentId < 88 && !isRightEdge) click(squares[currentId + 1 + width])
    if (currentId < 89) click(squares[currentId + width])
  }, 10)
}

function addFlag(square) {
  if (gameOver) return
  if (square.classList.contains('checked')) return

  if (!square.classList.contains('flag') && flags < bombAmount) {
    square.classList.add('flag')
    square.textContent = '🚩'
    flags++
  } else if (square.classList.contains('flag')) {
    square.classList.remove('flag')
    square.textContent = ''
    flags--
  }

  flagsLeftEl.textContent = bombAmount - flags
  checkWin()
}

function revealBombs() {
  squares.forEach(square => {
    if (square.classList.contains('bomb')) {
      square.textContent = '💣'
      square.classList.add('checked')
    }
  })
}

function checkWin() {
  let correctFlags = 0
  squares.forEach(square => {
    if (square.classList.contains('bomb') && square.classList.contains('flag')) {
      correctFlags++
    }
  })

  if (checkedValid === 90 || correctFlags === bombAmount) {
    result.textContent = 'YOU WIN!'
    gameOver = true
  }
}
