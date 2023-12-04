'use strict';
import { Model } from 'sequelize';

export const model = (sequelize, DataTypes) => {
    class Region extends Model {
        static associate() {
            const { Trend } = sequelize.models;
            this.hasMany(Trend, {
                foreignKey: 'regionId',
                as: 'trend',
                allowNull: false
            });
        }
    }

    Region.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            name: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Region',
            tableName: 'region'
        }
    );

    return Region;
};

export default model;
