const activationSigmoid = require('./activationSigmoid')

// var derivative_sigmoid = x => {
//   const fx = activation_sigmoid(x);
//   return fx * (1 - fx);
// }
function derivativeSigmoid(x) {
  const fx = activationSigmoid(x)
  return fx * (1 - fx)
}

module.exports = derivativeSigmoid
