package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type Flashcard struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

var flashcards = make([]Flashcard, 0)

const fileName = "flashcards.txt"

func main() {
	loadFlashcards()

	http.HandleFunc("/flashcards", flashcardsHandler)
	http.Handle("/", http.FileServer(http.Dir("./public")))

	fmt.Println("Server started on :8080")
	// Listen on default port 22
	http.ListenAndServe(":8080", nil)
}

func flashcardsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		json.NewEncoder(w).Encode(flashcards)
	case http.MethodPost:
		var flashcard Flashcard
		json.NewDecoder(r.Body).Decode(&flashcard)
		flashcards = append(flashcards, flashcard)
		saveFlashcards()
	default:
		http.Error(w, "Invalid method", 405)
	}
}

func loadFlashcards() {
	file, err := os.Open(fileName)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		question := scanner.Text()
		scanner.Scan()
		answer := scanner.Text()
		flashcards = append(flashcards, Flashcard{Question: question, Answer: answer})
	}
}

func saveFlashcards() {
	file, err := os.Create(fileName)
	if err != nil {
		fmt.Println("Failed to save flashcards.")
		return
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	for _, flashcard := range flashcards {
		fmt.Fprintln(writer, flashcard.Question)
		fmt.Fprintln(writer, flashcard.Answer)
	}
	writer.Flush()
}
