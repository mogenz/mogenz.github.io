let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [
        {question: "When rolling a die, what is the probability that the outcome is an 1. odd number? 2. non-prime number? 3. both odd and non-prime?", answer: "1. 1/2  2. 1/2  3. 1/6"},
        {question: "Can a system of linear equations have infinitely many solutions? If yes, under what conditions?", answer: "Yes, it can have infinitely many solutions if it's underdetermined (fewer equations than variables) and consistent."},
        {question: "Compute the inverse of the following 2x2 matrix [a b; c d] and verify it by multiplying it with the original matrix.", answer: "- no answer -"},
        {question: "Given these two vectors (3, 4) and (4, -3), are they orthogonal? Are these vectors (1, 2, 3), (4, 5, 6), and (7, 8, 9) linearly independent or dependent?", answer: "1. Yes, they are orthogonal as their dot product is zero. 2. They are linearly dependent because the rank of the matrix formed by these vectors is less than the number of vectors."},
        {question: "Define eigenvectors and eigenvalues. Given the following 2x2 matrix [a b; c d], calculate its eigenvectors and eigenvalues.", answer: "Eigenvectors are non-zero vectors that change at most by a scalar factor when a linear transformation is applied. Eigenvalues are the associated scalars. - no answer - for the given matrix."},
        {question: "Compute the dot product of the vectors (3, 4, 5) and (6, 7, 8).", answer: "The dot product is 86."},
        {question: "Can you calculate the dot product of two matrices? If not, why?", answer: "No, you cannot calculate the dot product of two matrices as the operation is defined between two vectors, not matrices."},
        {question: "Perform Gauss elimination on the following system of linear equations: x + y + z = 6, 2y + 5z = -4, 2x + 5y - z = 27.", answer: "After applying Gauss elimination, the solution of the system is x = 5, y = -4, and z = 3."},
        {question: "You are given a linear optimization problem to maximize the function f(x,y) = 3x + 2y subject to the constraints x + y <= 4, x >= 0, y >= 0. Graphically illustrate how you would solve this problem.", answer: "The max is at (4,0) and the solution is 12."},
        {question: "Define determinant. Compute the determinant of the following 3x3 matrix [2 5 2; 6 1 2; 3 5 6].", answer: "The determinant of 3x3 matrix [2 5 2; 6 1 2; 3 5 6] is -104."},
        {question: "Define determinant. Compute the determinant of the following 2x2 matrix [2 5 2; 6 1 2].", answer: "The determinant of 2x2 matrix [2 5; 6 1] is -28."},
        {question: "Multiply the vector (3, 5) with the following matrix [3 2; 5 1].", answer: "The result of the multiplication of the vector (3, 5) with the matrix [3 2; 5 1] is (19, 20)."},
        {question: "What is QR-factorization in simple terms? Provide a simple example.", answer: "QR factorization decomposes a matrix into a product of an orthogonal matrix Q and an upper triangular matrix R. It's used in many applications, including solving linear systems, eigenvalue problems, and least squares approximation."},
        {question: "Explain the simplex algorithm and what it is used for. Can you provide a simple example of it?", answer: "The Simplex Method or Simplex Algorithm is used for calculating the optimal solution to the linear programming problem. In other words, the simplex algorithm is an iterative procedure carried systematically to determine the optimal solution from the set of feasible solutions."},
        {question: "Define a vector and provide an example.", answer: "A vector is a quantity defined by direction and magnitude. Example: v = [3, 2]."},
        {question: "Define a matrix and provide an example.", answer: "A matrix is a two-dimensional array of numbers. Example: A = [1, 2; 3, 4]."},
        {question: "What is a basis? Provide an example.", answer: "A basis is a set of vectors that spans a space and is linearly independent. Example: The vectors (1,0) and (0,1) form a basis for 2D."},
        {question: "Define orthogonality.", answer: "Orthogonality refers to perpendicularity in vectors; two vectors are orthogonal if their dot product is zero."},
        {question: "What is a dot product? Provide an example.", answer: "A dot product is an operation between two vectors that returns a scalar. Example: The dot product of a = [a1, a2, ..., an] and b = [b1, b2, ..., bn] is a1b1 + a2b2 + ... + an*bn."},
        {question: "What is linear independence?", answer: "A set of vectors is linearly independent if no vector in the set can be expressed as a linear combination of others."},
        {question: "What is the rank of a matrix?", answer: "The rank of a matrix is the maximum number of linearly independent row vectors in the matrix."},
        {question: "What are the conditions for a matrix to be invertible?", answer: "A matrix is invertible if it is square (has the same number of rows as columns) and its determinant is non-zero."},
        {question: "What is linear programming?", answer: "Linear programming is a mathematical method for determining a way to achieve the best outcome (such as maximum profit or lowest cost) given a list of requirements represented as linear relationships."},
        {question: "Define a system of linear equations and provide an example.", answer: "A system of linear equations is a collection of linear equations involving the same variables. Example: x + 2y = 7 and 3x - y = 6."},
        {question: "What is the Gaussian Elimination method?", answer: "Gaussian elimination is a method for solving linear systems of equations by transforming the system to an upper triangular matrix from which solutions can easily be obtained."},
        {question: "What is the Gauss-Jordan Elimination method?", answer: "Gauss-Jordan elimination is a method for solving linear systems of equations by transforming the system to a form where each variable corresponds to exactly one equation, which makes the solutions immediately evident."},
        {question: "What is an eigenvalue of a matrix?", answer: "An eigenvalue of a matrix is a scalar such that when it is multiplied with a non-zero vector (eigenvector), the result is the same as multiplying that vector by the matrix."},
        {question: "What is an eigenvector of a matrix?", answer: "An eigenvector of a matrix is a non-zero vector that only changes by a scalar factor when that matrix is multiplied by it."},
        {question: "What is the transpose of a matrix?", answer: "The transpose of a matrix is obtained by flipping the matrix over its diagonal, switching the row and column indices of each element."},
        {question: "What is an orthogonal matrix?", answer: "An orthogonal matrix is a square matrix whose rows and columns are orthogonal unit vectors."},
        {question: "What is a unit vector?", answer: "A unit vector is a vector of length 1."},
        {question: "What is a scalar?", answer: "A scalar is a single number, in contrast with most of the other objects studied in linear algebra, which are usually arrays of multiple numbers."},
        {question: "What is a norm of a vector?", answer: "The norm of a vector is a measure of its length. In Euclidean space, it's calculated as the square root of the sum of the squares of the components."},
        {question: "What is a vector space?", answer: "A vector space is a collection of vectors that can be added together and multiplied by scalars, satisfying eight conditions called axioms."},
        {question: "What is a projection in the context of linear algebra?", answer: "A projection is a linear transformation that maps a vector onto a subspace."},
        {question: "What is the determinant of a matrix?", answer: "The determinant of a matrix is a special number that can be calculated from a square matrix."},
        {question: "What is an identity matrix?", answer: "An identity matrix is a square matrix in which all the elements of the principal diagonal are ones and all other elements are zeros."},
        {question: "What is a square matrix?", answer: "A square matrix is a matrix with the same number of rows and columns."},
        {question: "What is a null matrix?", answer: "A null matrix is a matrix where all elements are zeros."},
        {question: "What is a scalar matrix?", answer: "A scalar matrix is a square matrix in which all off-diagonal elements are zero and the diagonal elements are equal to each other."},
        {question: "What is a singular matrix?", answer: "A singular matrix is a square matrix that does not have an inverse because its determinant is zero."},
        {question: "What is a nonsingular matrix?", answer: "A nonsingular matrix is a square matrix that has an inverse."},
        {question: "What is the inverse of a matrix?", answer: "The inverse of a matrix is a matrix that, when multiplied with the original matrix, gives the identity matrix."},
        {question: "What is the rank of a matrix?", answer: "The rank of a matrix is the maximum number of linearly independent row vectors in the matrix."},
        {question: "What is a row-reduced echelon form of a matrix?", answer: "The row-reduced echelon form of a matrix is a form where each pivot is 1, all entries below and above pivots are 0, and the pivots occur to the right of the pivot above it."},
        {question: "What is a consistent system of equations?", answer: "A consistent system of equations is a system that has at least one solution."},
        {question: "What is an inconsistent system of equations?", answer: "An inconsistent system of equations is a system that has no solution."},
        {question: "What is an underdetermined system of equations?", answer: "An underdetermined system of equations is a system where the number of equations is less than the number of variables."},
        {question: "What is an overdetermined system of equations?", answer: "An overdetermined system of equations is a system where the number of equations is greater than the number of variables."},
        {question: "What is cubic spline interpolation?", answer: "Cubic spline interpolation is a method of curve fitting where a number of piece-wise third-degree polynomials are fit to a data set, such that each polynomial 'piece' connects two data points and the combined curve is smooth."},
        {question: "What are the properties of a cubic spline?", answer: "A cubic spline is continuous, its first and second derivatives are also continuous, and it is a piece-wise cubic function between each pair of consecutive nodes."},
        {question: "Why is cubic spline interpolation preferred over other interpolation methods?", answer: "Cubic spline interpolation is preferred as it provides a smooth curve that fits the data points and has nice mathematical properties, while also avoiding problems such as Runge's phenomenon which can occur with polynomial interpolation."},
        {question: "Explain the process of creating a cubic spline interpolation.", answer: "Cubic spline interpolation involves: 1) dividing the data into intervals, 2) fitting a cubic polynomial to each interval, 3) ensuring that the fitted polynomials meet at the data points, and 4) adjusting the polynomials so that their first and second derivatives are the same at these meeting points, ensuring smooth transitions."},
        {question: "What is a stochastic variable?", answer: "A stochastic variable, also known as a random variable, is a variable whose possible values depend on the outcomes of a certain random phenomenon."},
        {question: "What is the difference between a stochastic variable and a deterministic variable?", answer: "A deterministic variable has a value that is precisely determined through known relationships or functions, while the value of a stochastic variable is subject to randomness and can be described only in terms of probability distributions."},
        {question: "What is a Markov chain?", answer: "A Markov chain is a stochastic model describing a sequence of possible events in which the probability of each event depends only on the state attained in the previous event."},
        {question: "What are the properties of Markov chains?", answer: "The key property of a Markov chain is the 'memoryless' property or Markov property, which means that the future state depends only on the present state and not on the sequence of events that preceded it."},
        {question: "What is the method of least squares?", answer: "The method of least squares is a standard approach in regression analysis to approximate the solution of overdetermined systems by minimizing the sum of the squares of the residuals made in the results of every single equation."},
        {question: "Why is the least squares method used?", answer: "The least squares method is used to find the best-fitting curve to a given set of points by minimizing the sum of the squares of the offsets or the residuals of points from the plotted curve."},
        {question: "What is a polynomial?", answer: "A polynomial is an expression consisting of variables and coefficients, that involves only the operations of addition, subtraction, multiplication, and non-negative integer exponents of variables."},
        {question: "What is the degree of a polynomial?", answer: "The degree of a polynomial is the highest power of its variable."},
        {question: "What is a root of a polynomial?", answer: "A root of a polynomial is a value of the variable that makes the polynomial equal to zero."},
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
