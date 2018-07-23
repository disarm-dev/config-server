import { resolve } from 'path';

export const sails = require('sails');

export function setup_sails() {
  return new Promise((resolve, reject) => {
    sails.lift({
      // Your sails app's configuration files will be loaded automatically,
      // but you can also specify any other special overrides here for testing purposes.

      // For example, we might want to skip the Grunt hook,
      // and disable all logs except errors and warnings:
      hooks: { grunt: false },
      log: { level: 'silent' },

    }, (err) => {
      if (err) {
        reject(err)
      }

      resolve()
    });
  })
  
}

export function teardown_sails() {
  return new Promise((resolve, reject) => {
    sails.lower((err) => {
      if (err) reject(err)

      resolve()
    })
  })
}
