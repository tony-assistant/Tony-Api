'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OptionSchema extends Schema {
  up () {
    this.create('options', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('options')
  }
}

module.exports = OptionSchema
