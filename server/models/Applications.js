module.exports = (sequelize, DataTypes) => {
    const Applications = sequelize.define("Applications", {
        resume: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        experience: {
            type: DataTypes.ENUM('0-2','2-5','5+'),
            allowNull: false,
        },
        education: {
            type: DataTypes.ENUM('High School','College','University'),
            allowNull: false,
        },
    },{
        updatedAt: false
    });

    Applications.associate = (models) => {
        Applications.belongsTo(models.Users, {
        });

        Applications.belongsTo(models.Jobs, {
        });
    };
    
    


    return Applications;  
};