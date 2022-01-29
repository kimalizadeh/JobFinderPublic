module.exports = (sequelize, DataTypes) => {
    const Wishlists = sequelize.define("Wishlists", {

    },{
        timestamps: false,
    });

    Wishlists.associate = (models) => {
        Wishlists.belongsTo(models.Users, {
        });

        Wishlists.belongsTo(models.Jobs, {
        });
    };
    
    


    return Wishlists;  
};