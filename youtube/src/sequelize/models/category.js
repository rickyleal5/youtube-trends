'use strict';
import { Model } from 'sequelize';

export const model = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate() {
            const { Video } = sequelize.models;
            this.hasMany(Video, {
                foreignKey: 'categoryId',
                as: 'video',
                allowNull: false
            });
        }
    }

    Category.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            title: DataTypes.STRING,
            assignable: DataTypes.BOOLEAN,
            etag: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Category',
            tableName: 'category'
        }
    );

    return Category;
};

export default model;
