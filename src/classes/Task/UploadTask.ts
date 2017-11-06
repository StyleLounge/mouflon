/// <reference path="../../../typings/index.d.ts" />
import fs = require('fs');
import Q = require('q');

import AbstractTask from "./AbstractTask";
import Task from "./Task";

export default class UploadTask extends AbstractTask implements Task {

    execute() {
        let deferred = Q.defer();

        this.services.log.startSection('Executing upload command');

        this.services.config.getHostsForStage().forEach(host => {

            const sources = this.getPrefs()['sources'];
            const destinations = this.getPrefs()['destinations'];

            let uploads = [],
                sshClient = this.services.sshClientFactory.getClient(host);

            sources.map((source, index) => {
                const remotePath = destinations[index];
                uploads = this.uploadFiles(uploads, source, sshClient, remotePath);
                uploads.reduce(Q.when, Q(null)).then(
                    () => {
                        this.services.log.closeSection(`All uploads done for host ${host} to remote address ${remotePath}`);
                        deferred.resolve(true);
                    },
                    error => deferred.reject(error)
                );
            });


        });

        return deferred.promise;
    }

    private uploadFiles(uploads: Array<any>, source: string, sshClient: any, remotePath: string) {
        let files = this.getFilesInDir(source);
        uploads = this.filterToType(files)
            .map(file => `${source}${file}`)
            .map(filePath => {
                return sshClient.upload(filePath, remotePath);
            });
        return uploads;
    }

    filterToType(files) {
        const fileTypes = this.getPrefs()['fileTypes'];
        if (fileTypes && fileTypes.length > 0) {
            const isInTypes = fileName => fileTypes.reduce((result, type) => fileName.endsWith(type) ? true : result, false);
            return files.filter(isInTypes);
        }
        return files;
    }

    private getFilesInDir = (dirName: string): Array<string> => fs.readdirSync(dirName)
        .filter(f => f.indexOf(".") !== 0);
}
