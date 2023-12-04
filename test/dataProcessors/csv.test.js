import { describe, it, afterEach, before } from 'mocha';
import { Database } from '../../youtube/src/sequelize/sequelize.js';
import { processCSV } from '../../youtube/src/processData/csv/index.js';
import { expect } from 'chai';
import { mocks } from '../mocks/objects/objects.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let db;

describe('CSV', function () {
    before(async function () {
        db = new Database();
        db.getModels();
        db.associate();
        await db.sync({ force: true });
    });

    afterEach(async function () {
        const { Region, Category, Channel, Video, Trend } = db.sequelize.models;
        await Trend.truncate({ cascade: true });
        await Video.truncate({ cascade: true });
        await Channel.truncate({ cascade: true });
        await Category.truncate({ cascade: true });
        await Region.truncate({ cascade: true });
    });

    it('should process a CSV file and store its data', async function () {
        const { Region, Category, Channel, Video, Trend } = db.sequelize.models;

        let regions = await Region.findAll({ raw: true });
        let categories = await Category.findAll({ raw: true });
        let channels = await Channel.findAll({ raw: true });
        let videos = await Video.findAll({ raw: true });
        let trends = await Trend.findAll({ raw: true });

        expect(regions).to.be.empty;
        expect(categories).to.be.empty;
        expect(channels).to.be.empty;
        expect(videos).to.be.empty;
        expect(trends).to.be.empty;

        await Region.upsert(mocks.regions[0]);
        await Category.bulkCreate(mocks.categories);

        await processCSV(db);
        await sleep(1000);

        channels = await Channel.findAll({
            raw: true,
            order: [['id', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        videos = await Video.findAll({
            raw: true,
            order: [['id', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        trends = await Trend.findAll({
            raw: true,
            order: [
                ['videoId', 'ASC'],
                ['trendingDate', 'ASC']
            ],
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
        });

        videos = videos.map((video) => {
            video.publishedAt = new Date(video.publishedAt).getTime();
            return video;
        });

        trends = trends.map((trend) => {
            trend.trendingDate = new Date(trend.trendingDate).getTime();
            return trend;
        });

        expect(channels).to.have.lengthOf(mocks.channels.length);
        expect(channels).to.eql(mocks.channels);

        expect(videos).to.have.lengthOf(mocks.videos.length);
        expect(videos).to.eql(mocks.videos);

        expect(trends).to.have.lengthOf(mocks.trends.length);
        expect(trends).to.eql(mocks.trends);
    });
});
