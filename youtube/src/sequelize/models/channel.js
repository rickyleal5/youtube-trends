'use strict';
import { Model } from 'sequelize';

export const model = (sequelize, DataTypes) => {
    class Channel extends Model {
        static associate() {
            const { Video } = sequelize.models;
            this.hasMany(Video, {
                foreignKey: 'channelId',
                as: 'video',
                allowNull: false
            });
        }
    }
    Channel.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            title: DataTypes.TEXT,
            videosPublished: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'Channel',
            tableName: 'channel'
        }
    );
    return Channel;
};

export default model;
