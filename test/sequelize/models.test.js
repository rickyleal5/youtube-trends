import { describe, it, afterEach, before } from 'mocha';
import { Database } from '../../youtube/src/sequelize/sequelize.js';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import countries from 'i18n-iso-countries';

let db;

describe('Database', async function () {
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

    describe('Models', function () {
        describe('Region', async function () {
            it('it should create a record in the database', async function () {
                const countryCode = faker.location.countryCode('alpha-2');
                const region = {
                    id: countryCode,
                    name: countries.getName(countryCode, 'en')
                };

                const { Region } = db.sequelize.models;
                const record = await Region.create(region);
                expect(record.dataValues).to.include(region);
            });
        });

        describe('Category', function () {
            it('it should create a record in the database', async function () {
                const category = {
                    id: faker.number.int(100),
                    etag: faker.string.uuid(),
                    title: faker.commerce.department(),
                    assignable: faker.datatype.boolean(0.5)
                };

                const { Category } = db.sequelize.models;
                const record = await Category.create(category);
                expect(record.dataValues).to.include(category);
            });
        });

        describe('Channel', function () {
            it('it should create a record in the database', async function () {
                const channel = {
                    id: faker.string.uuid(),
                    title: faker.commerce.department(),
                    videosPublished: faker.number.int(6)
                };

                const { Channel } = db.sequelize.models;
                const record = await Channel.create(channel);
                expect(record.dataValues).to.include(channel);
            });
        });

        describe('Video', function () {
            it('it should create a record in the database', async function () {
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

                const { Video, Channel, Category } = db.sequelize.models;
                await Category.create({ id: video.categoryId });
                await Channel.create({ id: video.channelId });
                const record = await Video.create(video);
                video.publishedAt = video.publishedAt.getTime();
                record.dataValues.publishedAt =
                    record.dataValues.publishedAt.getTime();
                expect(record.dataValues).to.include(video);
            });
        });

        describe('Trend', function () {
            it('it should create a record in the database', async function () {
                const trend = {
                    id: faker.number.int(100),
                    trendingDate: faker.date.between({
                        from: '2020-01-01T00:00:00Z',
                        to: '2023-01-01T00:00:00Z'
                    }),
                    viewCount: faker.number.int(100),
                    likes: faker.number.int(100),
                    dislikes: faker.number.int(100),
                    commentCount: faker.number.int(100),
                    commentsDisabled: faker.datatype.boolean(0.5),
                    ratingsDisabled: faker.datatype.boolean(0.5),
                    
                    channelId: faker.string.uuid(),
                    categoryId: faker.number.int(100),
                    videoId: faker.string.uuid(),
                    regionId: faker.location.countryCode('alpha-2')
                };

                const { Trend, Video, Channel, Category, Region } =
                    db.sequelize.models;
                await Region.create({ id: trend.regionId });
                await Category.create({ id: trend.categoryId });
                await Channel.create({ id: trend.channelId });
                await Video.create({
                    id: trend.videoId,
                    channelId: trend.channelId,
                    categoryId: trend.categoryId
                });
                const record = await Trend.create(trend);
                trend.trendingDate = trend.trendingDate.getTime();
                record.dataValues.trendingDate =
                    record.dataValues.trendingDate.getTime();
                expect(record.dataValues).to.include(trend);
            });
        });
    });
});
