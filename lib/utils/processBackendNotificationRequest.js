'use strict';

const isPlainObject = require('type/plain-object/is');
const coerceNaturalNumber = require('type/natural-number/coerce');
const coerceTimeValue = require('type/time-value/coerce');
const toShortString = require('type/lib/to-short-string');
const chalk = require('chalk');
const log = require('./log/serverlessLog');
const configUtils = require('./config');

const configPropertyName = 'shownNotificationsHistory';

const logError = message => {
  if (!process.env.SLS_STATS_DEBUG) return;
  log(`Notifications error: ${message}`);
};

module.exports = notifications => {
  if (!Array.isArray(notifications)) {
    logError(`Expected array, got ${toShortString(notifications)}`);
    return;
  }
  const shownNotificationsHistory = configUtils.get(configPropertyName) || {};
  notifications.some((notification, index) => {
    if (!isPlainObject(notification)) {
      logError(`Expected plain object at [${index}] got ${toShortString(notification)}`);
      return false;
    }
    if (!notification.code || typeof notification.code !== 'string') {
      logError(`Expected string at [${index}].code got ${toShortString(notification.code)}`);
      return false;
    }
    if (!notification.message || typeof notification.message !== 'string') {
      logError(`Expected string at [${index}].message got ${toShortString(notification.message)}`);
      return false;
    }
    const lastShown = coerceTimeValue(shownNotificationsHistory[notification.code]);
    if (lastShown) {
      if (
        lastShown >
        Date.now() - (coerceNaturalNumber(notification.visibilityInterval) || 24) * 60 * 60 * 1000
      ) {
        return false;
      }
    }
    const borderLength = 'Serverless: '.length + notification.message.length;
    process.stdout.write(
      `\n${'*'.repeat(borderLength)}\nServerless: ${chalk.yellowBright(
        notification.message
      )}\n${'*'.repeat(borderLength)}\n\n`
    );
    shownNotificationsHistory[notification.code] = Date.now();
    configUtils.set(configPropertyName, shownNotificationsHistory);
    return true;
  });
};
