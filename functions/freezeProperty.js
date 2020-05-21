function freezeProperty(object, propertyName, value) {
  if (arguments.length < 1) throw new Error("Must supply an object to freeze to")
  if (typeof object != 'object' || object === null) throw new Error("Object is not an object")
  if (arguments.length < 2) throw new Error("Must supply a property name")
  if (typeof propertyName != 'string') throw new Error("property name is not a string")
  if (arguments.length < 3) throw new Error("Must supply a value to freeze")
  Object.defineProperty(object, propertyName, {
    value: value,
    configurable: false,
    writable: false
  })
}

module.exports = freezeProperty
