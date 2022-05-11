import AbstractEntity from './AbstractEntity'
import Item from './Item'

export enum StateTypes {
  BOOLEAN = 'Boolean',
  STRING = 'String',
  NUMBER = 'Number',
}

abstract class State<T> extends AbstractEntity {
  readonly #name
  readonly #item
  #value

  constructor(id: number, item: Item, name: string) {
    super(id)
    this.#name = name
    this.#item = item
    this.#value = this.getDefaultValue()

    item.addState(this)
  }

  abstract getDefaultValue(): T

  protected abstract setDefaultValue(defaultValue: T): void

  setValue(value: T) {
    this.#value = value
  }

  getValue() {
    return this.#value
  }

  resetValue() {
    this.#value = this.getDefaultValue()
  }

  getName() {
    return this.#name
  }

  getItem() {
    return this.#item
  }
}
// ...

export default State
