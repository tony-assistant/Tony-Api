"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PhoneSchema extends Schema {
  up() {
    this.create("phones", (table) => {
      table.increments();
      table.string("name");
      table.string("phone");
      table.string("birth_date");
      table.string("cpf");
      table.timestamps();
    });
  }

  down() {
    this.drop("phones");
  }
}

module.exports = PhoneSchema;
