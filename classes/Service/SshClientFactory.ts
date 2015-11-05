/// <reference path="../../definitions/node/node.d.ts" />
/// <reference path="../../definitions/Q/Q.d.ts" />
/// <reference path="../../definitions/sprintf/sprintf.d.ts" />

import AbstractService = require('./AbstractService');
import SshClient = require("./SshClient");

class SshClientFactory extends AbstractService {

    private clientsForHost:{[hostName:string]:SshClient} = {};

    getClient(hostName:string):SshClient {
        if (undefined === this.clientsForHost[hostName]) {
            let server = this.services.config.getStageConfig().server;
            this.clientsForHost[hostName] = new SshClient(hostName, server.user, server.port);

        }
        return this.clientsForHost[hostName];
    }
}

export = SshClientFactory;