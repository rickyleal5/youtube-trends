'use strict';
import Debug from 'debug';
import { Database } from './sequelize/sequelize.js';
import { processCSV } from './processData/csv/index.js';
import { processJSON } from './processData/json/index.js';

const debug = Debug('youtube');

(async () => {
    debug('Creating database tables');
    const db = new Database();
    db.getModels();
    await db.sync({ force: true });
    await db.createMaterializedViews();
    await db.grantPrivileges();
    await db.sync();

    debug('Processing Youtube dataset');
    await processJSON(db);
    await processCSV(db);

    debug('Updating tables');
    db.associate();
    await db.createIndex();
    await db.updateTables();
    await db.sync();
})();
