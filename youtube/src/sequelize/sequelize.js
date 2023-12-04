'use strict';
import {
    Sequelize,
    DataTypes,
    ConnectionTimedOutError,
    TimeoutError
} from 'sequelize';
import Debug from 'debug';
import {
    getModels,
    createIndex,
    grantPrivileges,
    createMaterializedViews,
    refreshMaterializedViews,
    updateVideos,
    updateChannels
} from './utils/index.js';

const debugSequelize = Debug('sequelize');
const debug = Debug('database');

const config = {
    database: process.env.DATABASE,
    username: process.env.SEQUELIZE_USER,
    password: process.env.POSTGRES_PASSWORD,
    dialect: process.env.DIALECT,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    logging: debugSequelize,
    retry: {
        max: 3,
        match: [/Deadlock/i, ConnectionTimedOutError, TimeoutError]
    },
    pool: {
        max: 90
    }
};

export class Database {
    constructor() {
        this.sequelize = new Sequelize(config);
    }

    getModels() {
        debug('Getting models');
        const models = getModels(this.sequelize, DataTypes);
        debug(`Got models: ${Object.keys(models)}`);
    }

    associate() {
        debug('Creating associations');
        const { models } = this.sequelize;

        Object.values(models).map((model) => {
            if (model.associate) model.associate();
            return null;
        });
    }

    sync(options = {}) {
        debug('Syncing DB');
        return this.sequelize.sync(options);
    }

    createIndex() {
        debug('Creating Index');
        return createIndex(this.sequelize);
    }

    grantPrivileges() {
        debug('Grant privileges on new tables to Grafana');
        return grantPrivileges(this.sequelize);
    }

    createMaterializedViews() {
        debug('Creating materialized views');
        return createMaterializedViews(this.sequelize);
    }

    refreshMaterializedViews() {
        debug('Refreshing materialized views');
        return refreshMaterializedViews(this.sequelize);
    }

    updateTables() {
        debug('Updating tables');
        return Promise.all([
            updateVideos(this.sequelize),
            updateChannels(this.sequelize)
        ]);
    }
}

export default Database;
