interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseResult = (args: string[]): number[] => {
  if (args.length < 3) throw new Error("Not enough arguments");

  const numbers = [];
  for (let i = 2; i < args.length; i++) {
    numbers.push(Number(args[i]));
    if (isNaN(Number(args[i]))) throw new Error("Invalid input");
  }
  return numbers;
};

const calculateExercises = (
  exerciseHours: number[],
  target: number
): Result => {
  const sum = exerciseHours.reduce((acc, num) => acc + num, 0);
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter((a) => a !== 0).length;
  const average = sum / periodLength;

  let rating = 1;
  let ratingDescription = "Exercise goal not reached :(";

  if (average >= 2 && average < 3) {
    rating = 2;
    ratingDescription = "Goal reached, well done!";
  } else if (average >= 3) {
    rating = 3;
    ratingDescription = "Goal far surpassed, wow!!!";
  }

  return {
    periodLength,
    trainingDays,
    success: rating >= 2,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const target = 2.5;
  if (require.main === module) {
    const parsedResults = parseResult(process.argv);
    console.log(calculateExercises(parsedResults, target));
  }
} catch (error: unknown) {
  let errorMessage = "ERROR: ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;
