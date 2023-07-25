let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [
    // Your flashcard questions and answers
    { question: "When rolling a die, what is the probability that the outcome is an 1. odd number? 2. non-prime number? 3. both odd and non-prime?", answer: "1. 1/2  2. 1/2  3. 1/6" },
    { question: "Can a system of linear equations have infinitely many solutions? If yes, under what conditions?", answer: "Yes, it can have infinitely many solutions if it's underdetermined (fewer equations than variables) and consistent." },
    { question: "Compute the inverse of the following 2x2 matrix [a b; c d] and verify it by multiplying it with the original matrix.", answer: "- no answer -" },
    // Add more questions as necessary
];
let currentIndex = 0;

window.onload = function() {
    displayFlashcard();
};

function displayFlashcard() {
    if (flashcards.length === 0) {
        document.getElementById("question").textContent = "No flashcards yet.";
        return;
    }

    document.getElementById("question").textContent = flashcards[currentIndex].question;
    document.getElementById("answer").textContent = flashcards[currentIndex].answer;
}

function nextFlashcard() {
    currentIndex = (currentIndex + 1) % flashcards.length;
    hideAnswer();
    displayFlashcard();
}

function previousFlashcard() {
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    hideAnswer();
    displayFlashcard();
}

function revealAnswer() {
    document.getElementById("answer").style.display = "block";
}

function hideAnswer() {
    document.getElementById("answer").style.display = "none";
}

function addFlashcard() {
    let newQuestion = document.getElementById("newQuestion").value;
    let newAnswer = document.getElementById("newAnswer").value;
    flashcards.push({ question: newQuestion, answer: newAnswer });
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    document.getElementById("newQuestion").value = "";
    document.getElementById("newAnswer").value = "";
    displayFlashcard();
}
