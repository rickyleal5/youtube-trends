'use strict';
import Region from '../models/region.js';
import Channel from '../models/channel.js';
import Category from '../models/category.js';
import Video from '../models/video.js';
import Trend from '../models/trend.js';

export const getModels = (sequelize, DataTypes) => ({
    Region: Region(sequelize, DataTypes),
    Channel: Channel(sequelize, DataTypes),
    Category: Category(sequelize, DataTypes),
    Video: Video(sequelize, DataTypes),
    Trend: Trend(sequelize, DataTypes)
});

export const createIndex = (sequelize) => {
    return Promise.all([
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS trend_idx_trending_year ON trend (EXTRACT(YEAR FROM "trendingDate" AT TIME ZONE \'UTC\'));'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS trend_idx_region_trending_year ON trend ("regionId", EXTRACT(YEAR FROM "trendingDate" AT TIME ZONE \'UTC\'));'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS trend_idx_category_trending_year ON trend ("categoryId", EXTRACT(YEAR FROM "trendingDate" AT TIME ZONE \'UTC\'));'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS trend_idx_channel_trending_year ON trend ("channelId", EXTRACT(YEAR FROM "trendingDate" AT TIME ZONE \'UTC\'));'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS trend_idx_video_trending_year ON trend ("videoId", EXTRACT(YEAR FROM "trendingDate" AT TIME ZONE \'UTC\'));'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS video_idx_category ON video ("categoryId");'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS video_idx_channel ON video ("channelId");'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS video_idx_published_at ON video (EXTRACT(YEAR FROM "publishedAt" AT TIME ZONE \'UTC\'));'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS mv_trend_summary_idx_year_regionId ON trend_summary (year, "regionId");'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS mv_video_summary_idx_year_categoryId ON video_summary (year, "categoryId");'
        )
    ]);
};

export const grantPrivileges = (sequelize) => {
    return Promise.all([
        sequelize.query(
            `GRANT USAGE ON SCHEMA public TO ${process.env.GRAFANA_USER};`
        ),
        sequelize.query(
            `GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${process.env.GRAFANA_USER};`
        )
    ]);
};

export const createMaterializedViews = async (sequelize) => {
    return Promise.all([
        sequelize.query(
            'CREATE MATERIALIZED VIEW IF NOT EXISTS video_summary AS \
                SELECT \
                    EXTRACT(YEAR FROM "publishedAt") AS "year", \
                    "categoryId", \
                    COUNT(EXTRACT(YEAR FROM "publishedAt" AT TIME ZONE \'UTC\')) AS "videosPublished", \
                    SUM("viewCount") AS "viewCount", \
                    SUM(likes) AS likes, \
                    SUM(dislikes) AS dislikes, \
                    SUM("commentCount") AS "commentCount" \
                FROM video \
                GROUP BY "year", "categoryId" \
            WITH NO DATA;'
        ),
        sequelize.query(
            'CREATE MATERIALIZED VIEW IF NOT EXISTS trend_summary AS \
                SELECT \
                    EXTRACT(YEAR FROM "trendingDate") AS "year", \
                    "regionId", \
                    COUNT(*) AS "trendsCount", \
                    COUNT(DISTINCT "videoId") as "trendingVideos", \
                    COUNT(DISTINCT "channelId") as "trendingChannels", \
                    COUNT(DISTINCT "categoryId") as "trendingCategories" \
                FROM trend \
                GROUP BY "year", "regionId" \
            WITH NO DATA;'
        )
    ]);
};

export const refreshMaterializedViews = (sequelize) => {
    return Promise.all([
        sequelize.query('REFRESH MATERIALIZED VIEW video_summary;'),
        sequelize.query('REFRESH MATERIALIZED VIEW trend_summary;')
    ]);
};

export const updateVideos = async (sequelize) => {
    const query =
        '\
    SELECT \
        "videoId" AS id, \
        MAX("viewCount") AS "viewCount", \
        MAX("likes") AS "likes", \
        MAX("dislikes") AS "dislikes", \
        MAX("commentCount") AS "commentCount" \
    FROM \
        trend \
    WHERE \
        "categoryId" = :id \
    GROUP BY \
        "videoId";\
    ';

    const { Video, Category } = sequelize.models;
    const categories = await Category.findAll({
        attributes: ['id'],
        raw: true
    });
    
    for (const category of categories) {
        const videos = await sequelize.query(query, {
            replacements: { id: category.id }
        });

        await Video.bulkCreate(videos[0], {
            updateOnDuplicate: [
                'viewCount',
                'likes',
                'dislikes',
                'commentCount'
            ]
        });
    }
};

export const updateChannels = async (sequelize) => {
    const { Channel, Video } = sequelize.models;

    const channels = await Channel.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn('COUNT', sequelize.col('video.id')),
                    'videosPublished'
                ]
            ],
            exclude: ['createdAt', 'updatedAt', 'title']
        },
        raw: true,
        include: [
            {
                model: Video,
                attributes: [],
                as: 'video',
                required: true,
                duplicating: false
            }
        ],
        group: ['Channel.id']
    });

    await Channel.bulkCreate(channels, {
        updateOnDuplicate: ['videosPublished']
    });
};
