const selectors = { 
    boardContainer: document.querySelector('.board-container'), 
    board: document.querySelector('.board'), 
    moves: document.querySelector('.moves'), 
    timer: document.querySelector('.timer'), 
    start: document.querySelector('button'), 
    win: document.querySelector('.win') 
} 

const state = { 
    gameStarted: false, 
    flippedCards: 0, 
    totalFlips: 0, 
    totalTime: 0, 
    loop: null 
} 

const shuffle = array => { 
    const clonedArray = [...array]; 

    for (let index = clonedArray.length - 1; index > 0; index--) { 
        const randomIndex = Math.floor(Math.random() * (index + 1)); 
        const original = clonedArray[index]; 

        clonedArray[index] = clonedArray[randomIndex]; 
        clonedArray[randomIndex] = original; 
    } 

    return clonedArray; 
} 

const pickRandom = (array, items) => { 
    const clonedArray = [...array]; 
    const randomPicks = []; 

    for (let index = 0; index < items; index++) { 
        const randomIndex = Math.floor(Math.random() * clonedArray.length); 
        randomPicks.push(clonedArray[randomIndex]); 
        clonedArray.splice(randomIndex, 1); 
    } 

    return randomPicks; 
} 

const generateGame = () => { 
    const dimensions = parseInt(selectors.board.getAttribute('data-dimension')); 

    if (dimensions % 2 !== 0) { 
        throw new Error("The dimension of the board must be an even number."); 
    } 

    const images = [ 
        'Assets/img/image1.jpg', 'Assets/img/image2.jpg', 'Assets/img/image3.jpg', 'Assets/img/image4.jpg', 'Assets/img/image5.jpg', 
        'Assets/img/image6.jpg', 'Assets/img/image7.jpg', 'Assets/img/image8.jpg', 'Assets/img/image9.jpg', 'Assets/img/image10.jpg',
        'Assets/img/image11.jpg', 'Assets/img/image12.jpg', 'Assets/img/image13.jpg', 'Assets/img/image14.jpg', 'Assets/img/image15.jpg',
        'Assets/img/image16.jpg', 'Assets/img/image17.jpg', 'Assets/img/image18.jpg', 'Assets/img/image19.jpg', 'Assets/img/image20.jpg',
        'Assets/img/image21.jpg', 'Assets/img/image22.jpg', 'Assets/img/image23.jpg', 'Assets/img/image24.jpg', 'Assets/img/image25.jpg',
        'Assets/img/image26.jpg', 'Assets/img/image27.jpg', 'Assets/img/image28.jpg', 'Assets/img/image29.jpg', 'Assets/img/image30.jpg',
        'Assets/img/image31.jpg','Assets/img/image32.jpg',
    ];     
    const picks = pickRandom(images, (dimensions * dimensions) / 2); 
    const items = shuffle([...picks, ...picks]); 
    const cards = ` 
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)"> 
            ${items.map(item => ` 
                <div class="card"> 
                    <div class="card-front"></div> 
                    <div class="card-back"><img src="${item}" alt="Card image"></div> 
                </div> 
            `).join('')} 
        </div> 
    `; 

    const parser = new DOMParser().parseFromString(cards, 'text/html'); 
    selectors.board.replaceWith(parser.querySelector('.board')); 
} 

const startGame = () => { 
    state.gameStarted = true; 
    selectors.start.classList.add('disabled'); 

    state.loop = setInterval(() => { 
        state.totalTime++; 

        selectors.moves.innerText = `${state.totalFlips} moves`; 
        selectors.timer.innerText = `time: ${state.totalTime} sec`; 
    }, 1000); 
} 

const flipBackCards = () => { 
    document.querySelectorAll('.card:not(.matched)').forEach(card => { 
        card.classList.remove('flipped'); 
    }); 

    state.flippedCards = 0; 
} 

const flipCard = card => { 
    state.flippedCards++; 
    state.totalFlips++; 

    if (!state.gameStarted) { 
        startGame(); 
    } 

    if (state.flippedCards <= 2) { 
        card.classList.add('flipped'); 
    } 

    if (state.flippedCards === 2) { 
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)'); 

        if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) { 
            flippedCards.forEach(card => { 
                card.classList.add('matched'); 
            }); 
        } 

        setTimeout(() => { 
            flipBackCards(); 
        }, 1000); 
    } 

    if (!document.querySelectorAll('.card:not(.flipped)').length) { 
        setTimeout(() => { 
            selectors.boardContainer.classList.add('flipped'); 
            selectors.win.classList.add('show'); 
        }, 1000); 
    } 
} 

const attachEventListeners = () => { 
    document.addEventListener('click', event => { 
        const eventTarget = event.target; 
        const eventParent = eventTarget.parentElement; 

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) { 
            flipCard(eventParent); 
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) { 
            startGame(); 
        } 
    }); 
} 

generateGame(); 
attachEventListeners();