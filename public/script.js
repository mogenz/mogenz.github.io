let flashcards = [];
let currentIndex = -1;

window.onload = function() {
	document.getElementById("answer").style.display = "none";
	fetchFlashcards();
};

function fetchFlashcards() {
	fetch("/flashcards").then(response => response.json()).then(data => {
		flashcards = data;
		nextFlashcard();
	});
}

function nextFlashcard() {
	document.getElementById("answer").style.display = "none";
	if (flashcards.length == 0) {
		document.getElementById("question").textContent = "No flashcards yet.";
		return;
	}

	currentIndex = (currentIndex + 1) % flashcards.length;
	document.getElementById("question").textContent = flashcards[currentIndex].question;
}

function revealAnswer() {
	document.getElementById("answer").textContent = flashcards[currentIndex].answer;
	document.getElementById("answer").style.display = "block";
}

function addFlashcard() {
	let newQuestion = document.getElementById("newQuestion").value;
	let newAnswer = document.getElementById("newAnswer").value;
	fetch("/flashcards", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({question: newQuestion, answer: newAnswer}),
	}).then(() => {
		fetchFlashcards();
		document.getElementById("newQuestion").value = "";
		document.getElementById("newAnswer").value = "";
	});
}
