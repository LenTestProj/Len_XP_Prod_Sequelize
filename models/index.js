'use strict';

const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/*
|--------------------------------------------------------------------------
| Models
|--------------------------------------------------------------------------
| Associations are defined in each model's static associate(models).
*/

// Admin
const AdminRoles = require('./adminroles')(sequelize, DataTypes);
const AdminPermissions = require('./adminpermissions')(sequelize, DataTypes);
const AdminRolePermissions = require('./adminrolepermissions')(sequelize, DataTypes);
const AdminActivity = require('./adminactivity')(sequelize, DataTypes);
const Users = require('./users')(sequelize, DataTypes);
const Organizations = require('./organizations')(sequelize, DataTypes);

// Masters
const Taxes = require('./taxes')(sequelize, DataTypes);
const Units = require('./units')(sequelize, DataTypes);
const MaterialCategories = require('./materialcategories')(sequelize, DataTypes);
const Materials = require('./materials')(sequelize, DataTypes);

// Items
const Items = require('./items')(sequelize, DataTypes);
const FinishedProductDetails = require('./finishedproducts')(sequelize, DataTypes);
const PackagingMaterialDetails = require('./packagingmaterialdetails')(sequelize, DataTypes);
const ItemUomConversion = require('./itemuomconversion')(sequelize, DataTypes);
// TODO: RawMaterialDetails (no model yet)

// Formulations
const Formulations = require('./formulations')(sequelize, DataTypes);
const FormulationVersions = require('./formulationversions')(sequelize, DataTypes);
const FormulationLines = require('./formulationlines')(sequelize, DataTypes);

// Vendors & Warehouses
const Vendors = require('./vendor')(sequelize, DataTypes);
const Warehouses = require('./warehouses')(sequelize, DataTypes);
// TODO: VendorItem, VendorItemPriceHistory, WarehouseLocations (no models yet)

// Purchasing & Inventory
const PurchaseReceipts = require('./purchasereceipts')(sequelize, DataTypes);
const PurchaseReceiptLines = require('./purchasereceiptlines')(sequelize, DataTypes);
const InventoryLots = require('./inventorylots')(sequelize, DataTypes);

const db = {
    AdminRoles,
    AdminPermissions,
    AdminRolePermissions,
    AdminActivity,
    Users,
    Organizations,
    Taxes,
    Units,
    MaterialCategories,
    Materials,
    Items,
    FinishedProductDetails,
    PackagingMaterialDetails,
    ItemUomConversion,
    Formulations,
    FormulationVersions,
    FormulationLines,
    Vendors,
    Warehouses,
    PurchaseReceipts,
    PurchaseReceiptLines,
    InventoryLots,
};

/*
|--------------------------------------------------------------------------
| Associations
|--------------------------------------------------------------------------
*/

Object.values(db).forEach((model) => {
    if (model.associate) {
        model.associate(db);
    }
});

module.exports = { sequelize, Sequelize, ...db };
