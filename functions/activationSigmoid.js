// var activation_sigmoid = x => 1 / (1 + Math.exp(-x));

function activationSigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

module.exports = activationSigmoid
