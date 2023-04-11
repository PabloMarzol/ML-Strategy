// const fetch = require("node-fetch");
const brain = require("brain.js");
const data = require("./dataSet.json");
const fs = require("fs");

const trainingModel = new brain.NeuralNetwork({
  hiddenLayers: [3, 3] // add two hidden layers with 3 neurons each
});

fs.readFile("dataSet.json", "utf8", (err, data) => {
  if (err) {
    console.log("error");
    return;
  }

  const jsonData = JSON.parse(data);
  const trainingData = [];

  // Calculate mean and standard deviation of input data
  const inputs = jsonData.values.map(item => parseFloat(item.open));
  const mean = inputs.reduce((sum, value) => sum + value, 0) / inputs.length;
  const variance = inputs.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / inputs.length;
  const stdDev = Math.sqrt(variance);

  // Normalize input data
  const normalizedInputs = inputs.map(value => (value - mean) / stdDev);

  // Create training data with normalized inputs and outputs
  const halfIndex = Math.floor(jsonData.values.length / 1.5);

  normalizedInputs.slice(0, halfIndex).forEach((input, index) => {
    const output = [
        
        parseFloat(jsonData.values[index].close)
        
    ];
    trainingData.push({ input: [input], output: output });
  });

  trainingModel.train(trainingData, {
    learningRate: 0.01, // adjust learning rate if necessary
    iterations: 20000 // increase number of iterations if necessary
  });

  // Normalize input data for prediction
  const input = (160.615 - mean) / stdDev;
  const pricePrediction = trainingModel.run([input]);

  // Denormalize output data for prediction
  const denormalizedPrediction = pricePrediction.map(value => (value * stdDev) + mean);

  console.log(`The Close of tomorrow will be: ${denormalizedPrediction}`);
});





