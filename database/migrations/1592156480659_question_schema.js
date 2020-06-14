"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class QuestionSchema extends Schema {
  up() {
    this.create("questions", (table) => {
      table.increments();
      table.string("question");
      table.string("status");
      table.integer("weight");
      table.timestamps();
    });
  }

  down() {
    this.drop("questions");
  }
}

module.exports = QuestionSchema;
