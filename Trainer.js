const NeuralNetwork = require('./NeuralNetwork')

class Trainer {
  constructor(network) {
    if (!(network instanceof NeuralNetwork)) throw new Error("Must supply a neural network to train")
  }
}

module.exports = Trainer
