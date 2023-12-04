'use strict';
import fs from 'fs';
import path from 'path';
import Debug from 'debug';
import { extractRegion, extractCategories } from './utils.js';

const debug = Debug('youtube');

export const processJSON = async (db) => {
    debug('Processing JSON files');
    const jsonFilePaths = fs
        .readdirSync(process.env.DATA_FOLDER)
        .filter((file) => path.extname(file) === '.json')
        .map((file) => path.join(process.env.DATA_FOLDER, file));

    for (const filePath of jsonFilePaths) {
        await processFile(filePath, db);
    }
};

const processFile = async (filePath, db) => {
    const data = extractData(filePath);
    const transformedData = transformData(data);
    return loadData(transformedData, db);
};

const extractData = (filePath) => {
    const regionCode = filePath.split('/').at(-1).substring(0, 2);
    const rawData = fs.readFileSync(filePath);
    return { regionCode, json: JSON.parse(rawData) };
};

const transformData = (data) => {
    const transformedData = {
        region: extractRegion(data),
        categories: extractCategories(data)
    };
    return transformedData;
};

const loadData = async (data, db) => {
    const { Region, Category } = db.sequelize.models;
    await Promise.all([
        Region.upsert(data.region),
        Category.bulkCreate(data.categories, {
            updateOnDuplicate: ['name', 'assignable', 'etag']
        })
    ]);
};
