import { useState } from "react";

// The shape of one quiz question
type Question = {
  text: string;
  options: string[];
  answer: number; // index of the correct option in `options`
};

// 5 hardcoded questions
const questions: Question[] = [
  {
    text: "Which keyword declares a variable that can't be reassigned?",
    options: ["let", "var", "const", "fixed"],
    answer: 2,
  },
  {
    text: "What file extension lets you write HTML-like code in TypeScript?",
    options: [".ts", ".tsx", ".html", ".jsx.ts"],
    answer: 1,
  },
  {
    text: "Which command starts the Vite dev server?",
    options: ["npm start dev", "npm run dev", "npx vite go", "node dev"],
    answer: 1,
  },
  {
    text: "Which React hook stores data that changes?",
    options: ["useData", "useChange", "useState", "useValue"],
    answer: 2,
  },
  {
    text: "Which Git command saves a snapshot of your changes?",
    options: ["git save", "git push", "git commit", "git snapshot"],
    answer: 2,
  },
];

export default function App() {
  const [current, setCurrent] = useState(0); // which question we're on
  const [selected, setSelected] = useState<number | null>(null); // option the user picked
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  function pickAnswer(index: number) {
    if (selected !== null) return; // already answered this question
    setSelected(index);
    if (index === question.answer) {
      setScore(score + 1);
    }
  }

  function next() {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  const page = { maxWidth: 500, margin: "60px auto", padding: 20, fontFamily: "sans-serif" };

  if (finished) {
    return (
      <div style={page}>
        <h1>Quiz complete!</h1>
        <p style={{ fontSize: 24 }}>
          You scored {score} out of {questions.length}.
        </p>
        <button onClick={restart}>Play again</button>
      </div>
    );
  }

  // Fraction of questions answered so far (counts the current one once answered)
  const answered = current + (selected !== null ? 1 : 0);
  const progress = (answered / questions.length) * 100;

  return (
    <div style={page}>
      <p>
        Question {current + 1} of {questions.length}
      </p>

      {/* Progress bar: a grey track with a green fill whose width is the percent answered */}
      <div style={{ height: 10, background: "#ddd", borderRadius: 5, overflow: "hidden", marginBottom: 20 }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "#4caf50",
            transition: "width 0.3s",
          }}
        />
      </div>
      <h2>{question.text}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {question.options.map((option, index) => {
          let background = "#eee";
          if (selected !== null) {
            if (index === question.answer) background = "#b6f2c0"; // correct: green
            else if (index === selected) background = "#f7b6b6"; // wrong pick: red
          }
          return (
            <button
              key={index}
              onClick={() => pickAnswer(index)}
              style={{ padding: 12, fontSize: 16, background, color: "#000", textAlign: "left" }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontWeight: "bold" }}>
            {selected === question.answer ? "Correct!" : "Wrong."}
          </p>
          <button onClick={next}>
            {current + 1 < questions.length ? "Next" : "See score"}
          </button>
        </div>
      )}
    </div>
  );
}