module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        email: {
            type: DataTypes.STRING(250),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('Employee','Employer','Admin'),
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
    },{
        timestamps: false,
    }
    );

    Users.associate = (models) => {
        Users.hasMany(models.Jobs,{
            onDelete: "cascade",

        });

        Users.hasMany(models.Applications,{
            onDelete: "cascade",
        });

        Users.hasMany(models.Wishlists,{  
            onDelete: "cascade",
        });
      };
      
    return Users;
};