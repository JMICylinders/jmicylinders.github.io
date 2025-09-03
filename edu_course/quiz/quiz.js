function checkQuiz() {
  let score = 0;
  let total = 5;

  // Correct answers
  let answers = { q1: "b", q2: "c", q3: "b", q4: "a", q5: "b" };

  for (let q in answers) {
    let selected = document.querySelector(`input[name="${q}"]:checked`);
    if (selected && selected.value === answers[q]) {
      score++;
    }
  }

  document.getElementById("quizResult").innerText =
    `✅ You scored ${score} out of ${total}`;

  // Ask user for name
  let name = prompt("Enter your name to save your score:");

  if (name) {
    fetch("https://script.google.com/macros/s/AKfycbxxjvLF4G0BhQfJUygzxncsmkemuKbnfiPnxkCNQM4_RtJWvbl19PA2YQ4XWb7ZDH-l/exec", {
      method: "POST",
      body: JSON.stringify({ name: name, score: score }),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.text())
    .then(data => console.log(data))
    .catch(err => console.error(err));
  }
}
