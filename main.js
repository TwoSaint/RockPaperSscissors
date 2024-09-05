let collision = 0;
let itemCount = 0;
let speedMultiplier = 1;
let items = []; // To keep track of all items for collision detection
let collisionEnabled = false; // To control when collisions are enabled
let randomnessValue = 40;
let speedValue = 3.7

// Update the randomnessValue based on slider input
const randomnessSlider = document.getElementById('randomnessSlider');
randomnessSlider.addEventListener('input', () => {
    randomnessValue = parseInt(randomnessSlider.value, 10);
});
const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', () => {
    speedValue = parseInt(speedSlider.value, 10);
});
// Function to create and animate bouncing
function createTeam(teamClass) {
    itemCount += 1;

    const gameContainer = document.getElementById('gameContainer');
    const item = document.createElement('div');
    item.className = `item ${teamClass}`;
    gameContainer.appendChild(item);

    const margin = 50;
    let posX = Math.random() * (window.innerWidth - 2 * margin) + margin;
    let posY = Math.random() * (window.innerHeight - 2 * margin) + margin;

    let velX = (Math.random() - 0.5) * speedValue;
    let velY = (Math.random() - 0.5) * speedValue;

    let updateCount = 0; // Unique to each item

    function update() {
        
        if (updateCount % randomnessValue === 0) {
            velX = (Math.random() - 0.5) * speedValue;
            velY = (Math.random() - 0.5) * speedValue;
        }
        updateCount++;

        // Bounce off walls
        if (posX < 0 || posX > window.innerWidth - item.clientWidth) {
            velX = -velX;
            collision += 1;
        }
        if (posY < 0 || posY > window.innerHeight - item.clientHeight) {
            velY = -velY;
            collision += 1;
        }

        posX += velX * speedMultiplier;
        posY += velY * speedMultiplier;

        if (collisionEnabled) {
            // Check for collisions with other items only if enabled
            for (let other of items) {
                if (other === item) continue; // Skip checking collision with itself

                let otherPosX = parseFloat(other.style.left);
                let otherPosY = parseFloat(other.style.top);

                if (Math.abs(posX - otherPosX) < 50 && Math.abs(posY - otherPosY) < 50) {
                    handleCollision(item, other);
                }
            }
        }

        item.style.left = `${posX}px`;
        item.style.top = `${posY}px`;

        requestAnimationFrame(update);
    }

    update();
    items.push(item); // Add this item to the list of items
}

// Function to handle the collision and determine the winner
function handleCollision(item1, item2) {
    const team1 = item1.classList[1]; // Get the team class of item1
    const team2 = item2.classList[1]; // Get the team class of item2

    let winner;

    switch (team1) {
        case 'rock':
            if (team2 === 'scissors') winner = item1;
            else if (team2 === 'paper') winner = item2;
            break;
        case 'paper':
            if (team2 === 'rock') winner = item1;
            else if (team2 === 'scissors') winner = item2;
            break;
        case 'scissors':
            if (team2 === 'paper') winner = item1;
            else if (team2 === 'rock') winner = item2;
            break;
    }

    if (winner) {
        // Convert the loser to the winner's team
        const loser = winner === item1 ? item2 : item1;
        loser.className = `item ${winner.classList[1]}`;
        loser.style.backgroundImage = winner.style.backgroundImage;
    }
}

// Create each team
for (let i = 0; i < 20; i++) {
    createTeam('scissors');
    createTeam('rock');
    createTeam('paper');
}

// Enable collisions when the "fight" button is clicked
document.getElementById('fightButton').addEventListener('click', function() {
    collisionEnabled = true;
    this.style.display = 'none'; // Hide the button after clicking
});
