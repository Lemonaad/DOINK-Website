class Vector {
  constructor(...components) {
    this.components = components
  }

  add({ components }) {
    return new Vector(
      ...components.map((component, index) => this.components[index] + component)
    )
  }
  
  subtract({ components }) {
    return new Vector(
      ...components.map((component, index) => this.components[index] - component)
    )
  }

  scaleBy(number) {
    return new Vector(
      ...this.components.map(component => component * number)
    )
  }

  length() {
    return Math.hypot(...this.components)
  }

  dotProduct({ components }) {
    return components.reduce((acc, component, index) => acc + component * this.components[index], 0)
  }

  normalize() {
    return this.scaleBy(1 / this.length())
  }

  angleBetween(other) {
    return toDegrees(
      Math.acos(
        this.dotProduct(other) /
        (this.length() * other.length())
      )
    )
  }

  negate() {
    return this.scaleBy(-1)
  }

  projectOn(other) {
    const normalized = other.normalize()
    return normalized.scaleBy(this.dotProduct(normalized))
  }

  withLength(newLength) {
    return this.normalize().scaleBy(newLength)
  }
}