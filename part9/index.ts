import express from "express";
const app = express();
app.use(express.json());
import calculateBmi from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const weight = req.query.weight;
  const height = req.query.height;

  if (!weight || !height || isNaN(Number(weight)) || isNaN(Number(height))) {
    res.status(400).json({ error: "malformatted parameters" });
  } else {
    const bmi = calculateBmi(Number(height), Number(weight));
    res.json({ weight, height, bmi });
  }
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = req.body as {
    daily_exercises: number[];
    target: number;
  };

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }
  if (
    !Array.isArray(daily_exercises) ||
    isNaN(Number(target)) ||
    daily_exercises.some((num) => isNaN(Number(num)))
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const result = calculateExercises(daily_exercises, target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
