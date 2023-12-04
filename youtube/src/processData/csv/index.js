'use strict';
import fs from 'fs';
import path from 'path';
import Debug from 'debug';
import csv from 'csv-parser';
import _ from 'lodash';
import { extractTrend } from './utils.js';

const debug = Debug('youtube');

export const processCSV = async (db) => {
    debug('Processing CSV files');
    const csvFilePaths = fs
        .readdirSync(process.env.DATA_FOLDER)
        .filter((file) => path.extname(file) === '.csv')
        .map((file) => path.join(process.env.DATA_FOLDER, file));

    for (const filePath of csvFilePaths) {
        await processFile(filePath, db);
    }
};

const processFile = async (filePath, db) => {
    debug(`Processing CSV file: ${filePath}`);
    let trends = [];
    const regionCode = filePath.split('/').at(-1).substring(0, 2);
    const rs = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 });
    const parser = csv();

    // Extract the data

    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
        rs.pipe(parser)
            .on('data', (data) => {
                /* 
                Ignore invalid data.
                1)Ignore trends with zero or negative views.
                2)Ignore trends with negative likes, dislikes or comments.
                */
                if (parseInt(data.view_count) > 0
                    && parseInt(data.likes) >= 0
                    && parseInt(data.dislikes) >= 0
                    && parseInt(data.comment_count) >= 0) trends.push(data);


                if (trends.length >= process.env.CHUNK_SIZE) {
                    rs.pause();
                    transformAndLoadData(trends, regionCode, db);
                    trends = [];
                    rs.resume();
                }
            })
            .on('end', () => {
                transformAndLoadData(trends, regionCode, db);
                resolve();
            });
    });
};

// Transform and Load in the same function to avoid passing around the large array of objects
const transformAndLoadData = async (data, regionCode, db) => {
    // Transform the data
    const trends = data.map((trend) => extractTrend(trend, regionCode));
    const channels = _.uniqBy(
        trends.map((trend) => ({
            id: trend.channelId,
            title: trend.channelTitle
        })),
        'id'
    );
    const videos = _.uniqBy(
        trends.map((trend) => ({
            ...trend,
            dowPublished: new Date(trend.publishedAt).getUTCDay(),
            id: trend.videoId
        })),
        'id'
    );

    // Load the data

    const { Channel, Video, Trend } = db.sequelize.models;
    await Channel.bulkCreate(channels, { ignoreDuplicates: true });
    await Video.bulkCreate(videos, { ignoreDuplicates: true, hooks: false });
    await Trend.bulkCreate(trends);
};
