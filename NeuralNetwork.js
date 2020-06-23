const {sanitize} = require('sandhands')
const freezeProperty = require('./functions/freezeProperty')
const autoBind = require('auto-bind')
const seedRandom = require('seedrandom')
const {inspect} = require('util')
const Neuron = require('./Neuron')
const deepEqual = require('deep-equal')
const jsonfile = require('jsonfile')


const defaultOptions = {
  inputNeurons: 1,
  outputNeurons: 1
}

const optionsFormat = {
  _: {
    outputNeurons: {
      _: Number,
      min: 1,
      integer: true
    },
    hiddenLayers: {
      _: [{
        _: Number,
        min: 1,
        integer: true
      }],
      minLength: 0,
      strict: false
    },
    inputNeurons: {
      _: Number,
      min: 1,
      integer: true
    },
    seed: {
      _: Number,
      min: 1,
      integer: true
    }
  },
  strict: true
}

class NeuralNetwork {
  constructor(options={}) {
    autoBind(this)
    if (options === null) options = {}
    if (typeof options != 'object') throw new Error("Options must be an object or null")
    options = {...defaultOptions, ...options}
    if (!options.hasOwnProperty("seed")) options.seed = Math.round(2000 * Math.random())
    if (!options.hasOwnProperty("hiddenLayers")) options.hiddenLayers = [options.inputNeurons]
    Object.freeze(options)
    sanitize(options, optionsFormat)
    //if (options.hiddenLayers < options.inputNeurons) throw new Error("There cannot be less hidden layer neurons than the number of input neurons")
    options.hiddenLayers.forEach(layer => {
      if (layer < options.inputNeurons) throw new Error("Cannot have less hidden layers than the number of input neurons")
    })
    freezeProperty(this, 'options', options)
    this.setSeed(this.options.seed)
    this.neurons = {
      input: [],
      hidden: [],
      output: []
    }
    this.initializeNeurons()
    Object.defineProperty(this, 'neuronsArray', {
      configurable: false,
      get: () => {
        return [this.neurons.input, ...this.neurons.hidden, this.neurons.output]
      }
    })
  }
  clone() {
    return new NeuralNetwork(this.options)
  }
  setSeed(seed) {
    if (!isFinite(seed) || seed < 0 || ((seed % 1) !== 0)) throw new Error("Must supply a non-negative integer as the seed")
    this.random = seedRandom(seed)
  }
  initializeNeurons() {
    for (let i = 0; i < this.options.inputNeurons; i++) {
      this.neurons.input[i] = new Neuron('input', {
        network: this,
        neuronIndex: i
      })
    }
    for (let i = 0; i < this.options.hiddenLayers.length; i++) {
      const layerSize = this.options.hiddenLayers[i]
      const layer = []
      for (let t = 0; t < layerSize; t++) {
        layer[t] = new Neuron('hidden', {
          network: this,
          neuronIndex: t,
          layerIndex: i
        })
      }
      this.neurons.hidden[i] = layer
    }
    for (let i = 0; i < this.options.outputNeurons; i++) {
      this.neurons.output[i] = new Neuron('output', {network: this})
    }
  }
  calculate(inputs, options) {
    const details = this.detailedOutput(inputs, options).output
    if (details.length <= 1) return details[0]
    return details
  }
  detailedOutput(inputs, options={}) {
    const {neuronsArray} = this
    let {breakLayer} = options
    if (options.hasOwnProperty('breakLayer') && !isFinite(breakLayer) || breakLayer < 0 || breakLayer >= neuronsArray.length) throw new Error("Invalid target layer")
    if (!Array.isArray(inputs)) throw new Error("Must supply an input array")
    if (inputs.length < this.options.inputNeurons) throw new Error("Input array too short")
    if (inputs.length > this.options.inputNeurons) throw new Error("Input array too long")

    let lastOutput = inputs
    let outputs = {}
    if (neuronsArray.length > 2) outputs.hidden = [] // initialize the hidden layers array if there are more than two layers

    for (let l = 0; l < neuronsArray.length; l++) {
      const layer = neuronsArray[l]
      if (l <= 0) { // Input Layer
        // Do Nothing
        outputs.inputs = lastOutput
      } else {
        lastOutput = this.getLayerOutput(layer, neuronsArray[l - 1], lastOutput)
        if (l >= neuronsArray.length - 1) { // last laster (aka output layer)
          outputs.output = lastOutput
        } else {
          outputs.hidden[l - 1] = lastOutput
        }
      }
      if (breakLayer === l) break // Allow getting the output of a specific layer
    }
    return outputs
  }
  getLayerOutput(layer, lastLayer, lastOutput) {
    const layerType = layer[0].type
    if (layerType === "input") throw new Error("Cannot get the output of the input layer")
    return layer.map(neuron => {
      return neuron.calculateOutput(lastLayer, lastOutput)
    })
  }
  async saveToDisk(path="network.json") {

  }
  getScores(...tests) {
    sanitize(tests, {
      _: [
        {
          input: {
            _: [{
              _: Number,
              integer: true,
              min: 0,
              max: 1
            }],
            length: this.neurons.input.length
          },
          output: {
            _: [{
              _: Number,
              integer: true,
              min: 0,
              max: 1
            }],
            length: this.neurons.output.length
          }
        }
      ],
      minLength: 1
    })
    return tests.map(test => {
      return this.calculate(test.input)
    })
  }
}

module.exports = NeuralNetwork
