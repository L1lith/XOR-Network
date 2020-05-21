const NeuralNetwork = require('./NeuralNetwork')
const activationSigmoid = require('./functions/activationSigmoid')

const network = new NeuralNetwork({
  seed: 1621,
  inputNeurons: 2,
  outputNeurons: 1
})

//console.log(network.neuronsArray)
//console.log(network.neurons.hidden[0][0].getPreviousLayer()[0].type)
//console.log(network.neurons.output[0].weights)
//console.log(activationSigmoid(1))
//console.log('output:', network.detailedOutput([0, 1]))

const tests = [{
  input: [0, 0],
  output: [0]
},
{
  input: [0, 1],
  output: [1]
},
{
  input: [1, 0],
  output: [1]
},
{
  input: [1, 1],
  output: [0]
}]

const cloneNetwork = network.clone()
cloneNetwork.initializeNeurons()

console.log("- WEIGHTS -")
console.log(network.neuronsArray.slice(1).map(layer => layer.map(neuron => neuron.weights)))
console.log("- WEIGHTS 2 -")
console.log(cloneNetwork.neuronsArray.slice(1).map(layer => layer.map(neuron => neuron.weights)))
console.log("- OUTPUT -")
console.log(network.detailedOutput([0, 1]))
console.log("- OUTPUT 2 -")
console.log(network.detailedOutput([0, 1]))
