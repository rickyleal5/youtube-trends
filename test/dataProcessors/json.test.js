import { describe, it, afterEach, before } from 'mocha';
import { Database } from '../../youtube/src/sequelize/sequelize.js';
import { processJSON } from '../../youtube/src/processData/json/index.js';
import { expect } from 'chai';
import { mocks } from '../mocks/objects/objects.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let db;

describe('JSON', function () {
    before(async function () {
        db = new Database();
        db.getModels();
        db.associate();
        await db.sync({ force: true });
    });

    afterEach(async function () {
        const { Region, Category } = db.sequelize.models;
        await Category.truncate({ cascade: true });
        await Region.truncate({ cascade: true });
    });

    it('should process a JSON file and store its data', async function () {
        const { Region, Category } = db.sequelize.models;

        let regions = await Region.findAll({ raw: true });
        let categories = await Category.findAll({ raw: true });

        expect(regions).to.be.empty;
        expect(categories).to.be.empty;

        processJSON(db);

        await sleep(1000);

        regions = await Region.findOne({ raw: true });
        categories = await Category.findAll({
            raw: true,
            order: [['id', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        expect(regions).to.include(mocks.regions[0]);
        expect(categories).to.have.lengthOf(mocks.categories.length);
        expect(categories).to.eql(mocks.categories);
    });
});
