'use strict';
import { Model } from 'sequelize';

export const model = (sequelize, DataTypes) => {
    class Trend extends Model {
        static associate() {
            const { Video, Region } = sequelize.models;
            this.belongsTo(Video, {
                foreignKey: 'videoId',
                as: 'video',
                allowNull: false
            });
            this.belongsTo(Region, {
                foreignKey: 'regionId',
                as: 'region',
                allowNull: false
            });
        }
    }
    Trend.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            trendingDate: DataTypes.DATE,
            viewCount: DataTypes.INTEGER,
            likes: DataTypes.INTEGER,
            dislikes: DataTypes.INTEGER,
            commentCount: DataTypes.INTEGER,
            commentsDisabled: DataTypes.BOOLEAN,
            ratingsDisabled: DataTypes.BOOLEAN,
            channelId: DataTypes.STRING,
            categoryId: DataTypes.INTEGER,
            videoId: DataTypes.STRING,
            regionId: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Trend',
            tableName: 'trend'
        }
    );

    // eslint-disable-next-line
    Trend.afterBulkCreate(async (trend, options) => {
        await sequelize.query('REFRESH MATERIALIZED VIEW trend_summary;');
    });

    return Trend;
};

export default model;
