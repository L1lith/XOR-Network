const NeuralNetwork = require('./NeuralNetwork')

const network = new NeuralNetwork({
  seed: 241,
  inputNeurons: 2,
  outputNeurons: 1
})

network.initializeNeurons()

network.neuronsArray.forEach((layer, layerIndex) => {
  if (layerIndex === 0) return
  layer.forEach(neuron => {
    neuron.weights.forEach((weight, index) => {
      neuron.weights[index] = 1
    })
  })
})

console.log(network.detailedOutput([0, 1]))
