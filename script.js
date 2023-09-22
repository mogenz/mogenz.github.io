let ownedColors = JSON.parse(localStorage.getItem('ownedColors') || '[]');
let combinations = JSON.parse(localStorage.getItem('combinations') || '[]');

window.addEventListener('load', () => {
    displayStoredColors();
    displayStoredCombinations();
});

function displayStoredColors() {
    ownedColors.forEach(color => {
        addColorDiv(color);
    });
}

function addNewColor() {
    const color = document.getElementById('new-color').value;
    ownedColors.push(color);
    localStorage.setItem('ownedColors', JSON.stringify(ownedColors));
    addColorDiv(color);
}

function addColorDiv(color) {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color-square';
    colorDiv.style.backgroundColor = color;
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'X';
    deleteButton.onclick = function() {
        const colorIndex = ownedColors.indexOf(color);
        if (colorIndex !== -1) {
            ownedColors.splice(colorIndex, 1);
            localStorage.setItem('ownedColors', JSON.stringify(ownedColors));
            colorDiv.remove();
        }
    };
    colorDiv.appendChild(deleteButton);
    document.getElementById('owned-yarns').appendChild(colorDiv);
}

function addExistingCombination() {
    const input = prompt("Enter the existing combination separated by commas (e.g., yellow,green,blue,red,orange)");
    if (input) {
        const colors = input.split(',');
        saveAndDisplayCombination(colors);
    }
}

function generateCombination() {
    const size = parseInt(document.getElementById('combo-size').value);
    if (ownedColors.length < size) {
        alert(`You need at least ${size} colors to generate a combination.`);
        return;
    }
    let randomCombination = [];
    while (randomCombination.length < size) {
        const index = Math.floor(Math.random() * ownedColors.length);
        const color = ownedColors[index];
        if (!randomCombination.includes(color)) {
            randomCombination.push(color);
        }
    }
    saveAndDisplayCombination(randomCombination);
}

function saveAndDisplayCombination(colors) {
    const combinationString = colors.join(',');
    if (combinations.includes(combinationString)) {
        return;
    }
    combinations.push(combinationString);
    localStorage.setItem('combinations', JSON.stringify(combinations));
    displayStoredCombinations();
}
function displayStoredCombinations() {
    const comboDiv = document.getElementById('combinations');
    comboDiv.innerHTML = "";
    combinations.forEach((combo, index) => {
        const colors = combo.split(',');
        displaySingleCombination(colors, index);
    });
    document.getElementById('total-combinations').innerText = `Total Combinations: ${combinations.length}`;
}
function displaySingleCombination(colors, index) {
    const combinationRow = document.createElement('div');
    combinationRow.className = 'combination-row';
    combinationRow.dataset.combo = colors.join(',');

    const indexText = document.createTextNode(`${index + 1}. `);
    combinationRow.appendChild(indexText);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'SLET';
    deleteButton.addEventListener("click", function() {
        const comboString = combinationRow.dataset.combo;
        const comboIndex = combinations.indexOf(comboString);
        if (comboIndex !== -1) {
            combinations.splice(comboIndex, 1);
            localStorage.setItem('combinations', JSON.stringify(combinations));
            displayStoredCombinations();  // Call this function to refresh all combinations and their index numbers
        }
    });

    combinationRow.appendChild(deleteButton);

    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-square';
        colorDiv.style.backgroundColor = color;
        combinationRow.appendChild(colorDiv);
    });

    document.getElementById('combinations').appendChild(combinationRow);
}
