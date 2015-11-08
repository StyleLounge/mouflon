/// <reference path="../../../typings/tsd.d.ts" />

import AbstractService from './AbstractService';
import DeployConfig from './DeployConfigService';
import Q = require('q');
import Shell = require('shelljs');
import async = require('async');

export default class ShellService extends AbstractService {

    exec(command:string, global?:boolean):Q.Promise<string> {
        let deferred = Q.defer<string>();

        if (!global) {
            command = `cd ${this.services.config.paths.getTemp() + this.services.config.projectName}%s; ${command}`;
        }
        this.services.log.debug('Executing: ' + command);
        let result = Shell.exec(command, {
            silent: !this.services.config.verbose
        });
        if (result.code === 0) {
            deferred.resolve(result.output);
        } else {
            deferred.reject(result.output);
        }

        return deferred.promise;
    }
}