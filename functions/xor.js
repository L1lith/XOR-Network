function xor(inputs) {
  if (!Array.isArray(inputs) || inputs.length !== 2 || inputs.some(value => value !== 0 && value !== 1)) throw new Error("Inputs should be two numbers, which are both either 1 or 0")
  let totalTrue = 0
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    if (input === 1) totalTrue++
  }
  return totalTrue === 1
}

module.exports = xor
