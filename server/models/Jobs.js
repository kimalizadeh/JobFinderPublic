module.exports = (sequelize, DataTypes) => {
    const Jobs = sequelize.define("Jobs", {
        jobTitle: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        salary: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        category: {
            type: DataTypes.ENUM('IT','Business','Finance','General','Engineering','Art'),
            allowNull: false,
        },
        jobType: {
            type: DataTypes.ENUM('Full-Time','Part-Time','Contract'),
            allowNull: false,
        },
        province: {
            type: DataTypes.ENUM('QC','ON','BC'),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(5000),
            allowNull: false,
        },
        activated:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        expiryDate:{
            type: DataTypes.DATE,
            allowNull: false,
        }
    });

    Jobs.associate = (models) => {
        Jobs.hasMany(models.Applications,{
            onDelete: "cascade",
        });

        Jobs.belongsTo(models.Users, {
            onDelete: "cascade" 
        });

        Jobs.hasMany(models.Wishlists,{
            onDelete: "cascade",
        });
    }

      
    return Jobs; 
};