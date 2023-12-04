'use strict';
import { Model } from 'sequelize';

export const model = (sequelize, DataTypes) => {
    class Video extends Model {
        static associate() {
            const { Channel, Category, Trend } = sequelize.models;
            this.belongsTo(Channel, {
                foreignKey: 'channelId',
                as: 'channel',
                allowNull: false
            });
            this.belongsTo(Category, {
                foreignKey: 'categoryId',
                as: 'category',
                allowNull: false
            });
            this.hasMany(Trend, {
                foreignKey: 'videoId',
                as: 'trend',
                allowNull: false
            });
        }
    }
    Video.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            title: DataTypes.TEXT,
            publishedAt: DataTypes.DATE,
            dowPublished: DataTypes.INTEGER,
            tags: DataTypes.TEXT,
            viewCount: DataTypes.INTEGER,
            likes: DataTypes.INTEGER,
            dislikes: DataTypes.INTEGER,
            commentCount: DataTypes.INTEGER,
            thumbnailLink: DataTypes.TEXT,
            commentsDisabled: DataTypes.BOOLEAN,
            ratingsDisabled: DataTypes.BOOLEAN,
            description: DataTypes.TEXT,
            channelId: DataTypes.STRING,
            categoryId: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'Video',
            tableName: 'video'
        }
    );

    // eslint-disable-next-line
    Video.afterBulkCreate(async (video, options) => {
        await sequelize.query('REFRESH MATERIALIZED VIEW video_summary;');
    });

    return Video;
};

export default model;
