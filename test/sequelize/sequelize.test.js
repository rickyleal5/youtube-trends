import { describe, it } from 'mocha';
import { Database } from '../../youtube/src/sequelize/sequelize.js';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe('Database', async function () {
    describe('Sequelize', function () {
        it('should get all models', async function () {
            const database = new Database();
            await database.sync({ force: true });
            expect(Object.keys(database.sequelize.models).length).to.equal(0);

            database.getModels();
            await database.sync({ force: true });
            expect(Object.keys(database.sequelize.models).length).to.equal(5);
        });

        it('should create indexes', async function () {
            const database = new Database();
            database.getModels();
            await database.sync({ force: true });
            await database.createMaterializedViews();

            const indexConfig = {
                indexname: 'video_idx_channel',
                tablename: 'video'
            };
            const query = `SELECT tablename, indexname, indexdef FROM pg_indexes WHERE indexname = '${indexConfig.indexname}';`;

            let result = await database.sequelize.query(query, {
                plain: true
            });
            expect(result).to.be.null;

            await database.createIndex();
            result = await database.sequelize.query(query, {
                plain: true
            });
            expect(result).to.include(indexConfig);
        });

        it('should grant privileges', async function () {
            const database = new Database();
            database.getModels();
            await database.sync({ force: true });
            await database.grantPrivileges();

            const result = await database.sequelize.query(
                `SELECT   pg_catalog.has_schema_privilege('${process.env.GRAFANA_USER}', 'public', 'USAGE');`,
                { plain: true }
            );

            expect(result.has_schema_privilege).to.be.true;
        });

        it('should create and refresh materialized views', async function () {
            const materializedView = 'video_summary';
            const database = new Database();
            database.getModels();
            await database.sync({ force: true });
            await database.createMaterializedViews();
            await database.sync();

            let result = await database.sequelize.query(
                'SELECT   matviewname, definition from pg_matviews;',
                { plain: true }
            );

            expect(result.matviewname).to.equal(materializedView);

            const regionId = faker.location.countryCode('alpha-2');
            const video = {
                id: faker.string.uuid(),
                title: faker.hacker.phrase(),
                publishedAt: faker.date.between({
                    from: '2020-01-01T00:00:00Z',
                    to: '2023-01-01T00:00:00Z'
                }),
                dowPublished: faker.number.int(6),
                tags: faker.word.words().replace(/ /g, '|'),
                viewCount: faker.number.int(100),
                likes: faker.number.int(100),
                dislikes: faker.number.int(100),
                commentCount: faker.number.int(100),
                thumbnailLink: faker.image.urlPlaceholder({
                    format: 'jpeg'
                }),
                commentsDisabled: faker.datatype.boolean(0.5),
                ratingsDisabled: faker.datatype.boolean(0.5),
                description: faker.lorem.text(),

                channelId: faker.string.uuid(),
                categoryId: faker.number.int(100)
            };

            const { Video, Channel, Category, Region } =
                database.sequelize.models;
            await Region.create({ id: regionId });
            await Category.create({ id: video.categoryId });
            await Channel.create({ id: video.channelId });
            await Video.create(video);

            await database.refreshMaterializedViews();
            await database.sync();
            await sleep(1000);

            result = await database.sequelize.query(
                `SELECT   * from ${materializedView};`,
                { plain: true }
            );

            expect(parseInt(result.viewCount)).to.equal(video.viewCount);
            expect(parseInt(result.likes)).to.equal(video.likes);
            expect(parseInt(result.dislikes)).to.equal(video.dislikes);
            expect(parseInt(result.commentCount)).to.equal(video.commentCount);
        });

        it('should update videos', async function () {
            const database = new Database();
            database.getModels();
            database.associate();
            await database.sync({ force: true });
            await database.createMaterializedViews();

            const regionId = faker.location.countryCode('alpha-2');
            const trend = {
                id: 0,
                trendingDate: faker.date.between({
                    from: '2020-01-01T00:00:00Z',
                    to: '2023-01-01T00:00:00Z'
                }),
                title: faker.hacker.phrase(),
                publishedAt: faker.date.between({
                    from: '2020-01-01T00:00:00Z',
                    to: '2023-01-01T00:00:00Z'
                }),
                tags: faker.word.words().replace(/ /g, '|'),
                viewCount: faker.number.int(100),
                likes: faker.number.int(100),
                dislikes: faker.number.int(100),
                commentCount: faker.number.int(100),
                thumbnailLink: faker.image.urlPlaceholder({
                    format: 'jpeg'
                }),
                commentsDisabled: faker.datatype.boolean(0.5),
                ratingsDisabled: faker.datatype.boolean(0.5),
                description: faker.lorem.text(),

                videoId: faker.string.uuid(),
                channelId: faker.string.uuid(),
                categoryId: faker.number.int(100),
                regionId: regionId
            };

            const { Video, Channel, Category, Region, Trend } =
                database.sequelize.models;
            await Region.create({ id: regionId });
            await Category.create({ id: trend.categoryId });
            await Channel.create({ id: trend.channelId });
            await Video.create({
                ...trend,
                id: trend.videoId,
                viewCount: null,
                likes: null,
                dislikes: null,
                commentCount: null
            });
            await Trend.create(trend);
            await database.sync();

            await database.updateTables();

            const result = await database.sequelize.query(
                'SELECT * from video;',
                { plain: true }
            );

            expect(parseInt(result.viewCount)).to.equal(trend.viewCount);
            expect(parseInt(result.likes)).to.equal(trend.likes);
            expect(parseInt(result.dislikes)).to.equal(trend.dislikes);
            expect(parseInt(result.commentCount)).to.equal(trend.commentCount);
        });
    });
});
