const {inspect} = require('util')
const freezeProperty = require('./functions/freezeProperty')
const neuronTypes = ["hidden", "input", "output"]
const autoBind = require('auto-bind')
const activationSigmoid = require('./functions/activationSigmoid')

class Neuron {
  constructor(type, options={}) {
    autoBind(this)
    if (typeof options != 'object' || options === null) throw new Error("Options must be an object")
    if (!neuronTypes.includes(type)) throw new Error(`Invalid Neuron Type ${inspect(type)}`)
    freezeProperty(this, 'type', type)
    freezeProperty(this, 'network', options.network)
    if (isFinite(options.layerIndex) && options.layerIndex >= 0) freezeProperty(this, 'layerIndex', options.layerIndex)
    if (isFinite(options.neuronIndex) && options.neuronIndex >= 0) freezeProperty(this, 'neuronIndex', options.neuronIndex)
    if (this.type !== 'input') this.generateWeights()
  }
  calculateOutput(previousOutput) {
    const {weights} = this
    if (!Array.isArray(previousOutput)) throw new Error("Please supply a previous output layer")
    if (weights.length !== previousOutput.length) throw new Error(`Previous output length and weights length do not match, Last Output: ${inspect(previousOutput)}, Weights: ${inspect(weights)}`)
    if (previousOutput.length !== weights.length) throw new Error("Previous output and weights size mismatch")
    return activationSigmoid(weights.map((weight, index) => {
      return weight * previousOutput[index]
    }).reduce((a, b) => a + b, 0) / weights.length)
  }
  getPreviousLayer() {
    if (this.type === "input") throw new Error("Cannot get the previous layer of the input layer")
    if (this.type === "hidden") { // If we're a hidden layer return the previous hidden layer, or instead if we're the first hidden layer return the input layer
      if (!isFinite(this.layerIndex)) throw new Error("Missing Layer Index, got "+ this.layerIndex)
      if (this.layerIndex === 0) {
        return this.network.neurons.input
      } else {
        return this.network.neurons.hidden[this.layerIndex - 1]
      }
    } else if (this.type === "output") { // Return the last hidden layer if we're at the output layer
      const totalHiddenLayers = this.network.neurons.hidden.length
      if (totalHiddenLayers === 0) {
        return this.network.neurons.input
      } else {
        return this.network.neurons.hidden[totalHiddenLayers - 1]
      }
    } else {
      throw new Error("Internal Error, Invalid Type")
    }
  }
  getNextLayer() {
    if (this.type === "output") throw new Error("Cannot get the next layer of the output layer")
    if (this.type === "hidden") { // If we're a hidden layer return the next hidden layer, or instead if we're the last hidden layer return the output layer
      if (!isFinite(this.layerIndex)) throw new Error("Missing Layer Index, got "+ this.layerIndex)
      if (this.layerIndex >= this.network.neurons.hidden.length - 1) {
        return this.network.neurons.output
      } else {
        return this.network.neurons.hidden[this.layerIndex + 1]
      }
    } else if (this.type === "input") { // Return the first hidden layer if we're at the input layer
      const totalHiddenLayers = this.network.neurons.hidden.length
      if (totalHiddenLayers === 0) {
        return this.network.neurons.output
      } else {
        return this.network.neurons.hidden[0]
      }
    } else {
      throw new Error("Internal Error, Invalid Type")
    }
  }
  generateWeights() {
    this.weights = []
    if (this.type === "input") throw new Error("The input layer cannot have weights")
    const previousLayer = this.getPreviousLayer()
    for (let i = 0; i < previousLayer.length; i++) {
      this.weights[i] = this.network.random()
    }
  }
}

module.exports = Neuron
