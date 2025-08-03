
/// create sequelize model for user
import { Sequelize, DataTypes } from 'sequelize';

/// create sequelize model for user
const users = (sequelize: Sequelize) => {
    console.log('Creating users model');
    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    /// sync model
    users.sync({ alter: true });

    return users;
};


export default users;