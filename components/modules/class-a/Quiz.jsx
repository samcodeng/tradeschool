"use client";
import { useState, useEffect } from "react";

export default function Quiz() {
  const [signs, setSigns] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mode, setMode] = useState("quiz");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/classA.json")
      .then((res) => res.json())
      .then((data) => {
        setSigns(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading signs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading questions...</div>;
  }

  if (signs.length === 0) {
    return <div className="p-8 text-center">No questions found</div>;
  }

  const current = signs[index];

  const handleAnswer = (option) => {
    if (!answers[index]) {
      setAnswers({ ...answers, [index]: option });
    }
  };

  const handleNext = () => {
    if (index + 1 < signs.length) {
      setIndex(index + 1);
    } else {
      setMode("results");
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setAnswers({});
    setMode("quiz");
  };

  const score = signs.reduce((acc, sign, i) => {
    const userAnswer = answers[i];
    const correctAnswer = sign?.answer;
    return userAnswer === correctAnswer ? acc + 1 : acc;
  }, 0);

  if (mode === "results") {
    return (
      <div className="max-w-4xl p-6 mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-center">Final Results</h2>
        <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <div className="mb-6 text-center">
            <div className="mb-2 text-6xl font-bold text-blue-600">{score}</div>
            <div className="text-xl text-gray-600">
              out of {signs.length} correct
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {Math.round((score / signs.length) * 100)}% accuracy
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 text-center bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  Object.keys(answers).filter(
                    (i) => answers[Number(i)] === signs[Number(i)]?.answer,
                  ).length
                }
              </div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="p-4 text-center bg-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {
                  Object.keys(answers).filter(
                    (i) => answers[Number(i)] !== signs[Number(i)]?.answer,
                  ).length
                }
              </div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
            <div className="p-4 text-center bg-yellow-100 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {signs.length - Object.keys(answers).length}
              </div>
              <div className="text-sm text-yellow-700">Unanswered</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setMode("review")}
            className="px-6 py-3 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Review Answers
          </button>
          <button
            onClick={handleRestart}
            className="px-6 py-3 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  if (mode === "review") {
    return (
      <div className="max-w-6xl p-6 mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-center">Review Mode</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {signs.map((sign, i) => {
            const userAnswer = answers[i];
            const correctAnswer = sign?.answer;
            let borderColor = "border-gray-300";
            let bgColor = "bg-white";

            if (!userAnswer) {
              borderColor = "border-yellow-500";
              bgColor = "bg-yellow-50";
            } else if (userAnswer === correctAnswer) {
              borderColor = "border-green-500";
              bgColor = "bg-green-50";
            } else {
              borderColor = "border-red-500";
              bgColor = "bg-red-50";
            }

            return (
              <div
                key={i}
                className={`border-2 ${borderColor} ${bgColor} rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{sign.name}</h3>
                  <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                    {sign.category}
                  </span>
                </div>
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-3 bg-gray-100 rounded-lg">
                  <div className="hidden text-xs text-center text-gray-500">
                    <div className="mb-1 text-2xl">🚦</div>
                    <div>{sign.name}</div>
                  </div>
                </div>
                <p className="mb-3 text-sm text-gray-600">{sign.meaning}</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Your Answer:</span>{" "}
                    {userAnswer || "Unanswered"}
                  </p>
                  <p>
                    <span className="font-medium">Correct Answer:</span>{" "}
                    {correctAnswer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRestart}
            className="px-6 py-3 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{current.name}</h2>
          <div className="text-sm text-gray-500">
            Question {index + 1} of {signs.length}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
            {current.category}
          </span>
          <div className="w-full h-2 mx-4 bg-gray-200 rounded-full">
            <div
              className="h-2 transition-all bg-blue-500 rounded-full"
              style={{ width: `${((index + 1) / signs.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">
            {Math.round(((index + 1) / signs.length) * 100)}%
          </span>
        </div>

        <div className="flex flex-col gap-6 mb-6 md:flex-row">
          <div className="w-full px-6">
            <p className="mb-6 text-lg text-gray-600">{current.meaning}</p>

            {current && (
              <div>
                <p className="mb-4 text-lg font-medium">{current.question}</p>
                <div className="grid grid-cols-1 gap-3">
                  {current.options.map((option) => {
                    const isSelected = answers[index] === option;
                    const isCorrect = option === current.answer;
                    const isAnswered = answers[index];

                    let buttonClass =
                      "px-4 py-3 rounded-lg border text-left transition-colors ";

                    if (isAnswered) {
                      if (isSelected) {
                        buttonClass += isCorrect
                          ? "bg-green-200 border-green-500 text-green-800"
                          : "bg-red-200 border-red-500 text-red-800";
                      } else {
                        buttonClass += isCorrect
                          ? "bg-green-100 border-green-300 text-green-700"
                          : "bg-gray-100 border-gray-300 text-gray-600";
                      }
                    } else {
                      buttonClass +=
                        "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={buttonClass}
                        disabled={isAnswered}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleNext}
            disabled={!answers[index]}
            className="px-6 py-3 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {index + 1 === signs.length ? "Finish Quiz" : "Next Question"}
          </button>
          <button
            onClick={() => setMode("review")}
            className="px-6 py-3 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            Review Mode
          </button>
        </div>
      </div>
    </div>
  );
}
