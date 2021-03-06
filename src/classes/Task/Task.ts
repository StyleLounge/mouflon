/// <reference path="../../../typings/index.d.ts" />

import Q = require('q');

interface Task {

    execute(): Q.Promise<any>;
    modify( modBody: string ): void;
}

export default Task;