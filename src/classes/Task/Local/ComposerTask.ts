/// <reference path="../../../../typings/index.d.ts" />

import Q = require('q');
import fs = require('fs');
import path = require('path');

import AbstractTask from './../AbstractTask';
import Task from './../Task';

export default class ComposerTask extends AbstractTask implements Task {

    execute() {
        let d        = Q.defer(),
            filename = path.join(this.services.config.pathConfig.getTemp(), this.services.config.projectName, 'composer.json');

        fs.readFile(filename, (err, settingsBuffer:Buffer) => {

            let info = JSON.parse(settingsBuffer + '');

            if (err) {
                this.services.log.startSection('Installing composer dependencies');
                this.services.log.warn('composer.json not present');
            } else {
                this.services.log.startSection(`Installing ${Object.keys(info.require).length} composer dependencies`);
            }

            this.services.shell.exec(this.services.config.globalConfig.composer.command + ' install --optimize-autoloader')
                .then((stdout) => {
                    this.services.log.closeSection('Composer dependencies installed');
                    d.resolve(true);
                }).fail(error => d.reject(error));
        });
        return d.promise;

    }
}