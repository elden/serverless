'use strict';

const { expect } = require('chai');

const overrideStdoutWrite = require('process-utils/override-stdout-write');
const processTargetNotifications = require('./processBackendNotificationRequest');

describe('lib/utils/processBackendNotificationRequest', () => {
  it('Should ignore invalid input', () => {
    processTargetNotifications();
    processTargetNotifications([
      null,
      'foo',
      NaN,
      new Error(),
      { message: 'FOO' },
      { code: 'CODE1' },
    ]);
  });

  it('Should show not shown notification', () => {
    let output = '';
    overrideStdoutWrite(
      data => (output += data),
      () => {
        processTargetNotifications([
          { code: 'CODE1', message: 'Some notification #1' },
          { code: 'CODE2', message: 'Some notification #2' },
        ]);
      }
    );
    expect(output).to.include('Some notification #1');
    expect(output).to.not.include('Some notification #2');
  });

  it('Should skip shown notification', () => {
    let output = '';
    overrideStdoutWrite(
      data => (output += data),
      () => {
        processTargetNotifications([
          { code: 'CODE1', message: 'Some notification #1' },
          { code: 'CODE2', message: 'Some notification #2' },
        ]);
      }
    );
    expect(output).to.not.include('Some notification #1');
    expect(output).to.include('Some notification #2');
  });
});
