const express = require("express");

const router = express.Router();

const authRoutes = require("./auth.routes");
const roleRoutes = require("./role.routes");
const permissionRoutes = require("./permission.routes");
const rolePermissionRoutes = require("./rolePermission.routes");
const userRoutes = require("./user.routes");
const unitRoutes = require("./unit.routes");
const taxRoutes = require("./tax.routes");
const warehouseRoutes = require("./warehouse.routes");
const vendorRoutes = require("./vendor.routes");
const organisationRoutes = require("./organisation.routes");
const itemRoutes  = require("./item.routes");
const rawMaterialRoutes   = require("./rawmaterialDetails.routes");
const packagingMaterialDetailsRoutes   = require("./packagingMaterialDetails.routes");
const finishedProductRoutes   = require("./finishedProduct.routes");
const ItemUomConversionRoutes   = require("./itemUomConversion.routes");
const FormulationRoutes = require('./formulation.routes');
const PurchaseReceipts = require('./purchaseReceipt.routes');
const VendorItems = require('./vendorItem.routes')

router.use("/auth", authRoutes);

router.use("/roles", roleRoutes);

router.use("/roles", rolePermissionRoutes);

router.use("/permissions", permissionRoutes);

router.use("/users", userRoutes);

router.use("/units", unitRoutes);

router.use("/taxes", taxRoutes);

router.use("/warehouses", warehouseRoutes);

router.use('/vendors',vendorRoutes)

router.use('/organisations',organisationRoutes)

router.use('/items',itemRoutes)

router.use('/rawmaterialsdetails',rawMaterialRoutes)

router.use('/packagingmaterialdetails',packagingMaterialDetailsRoutes)

router.use('/finishedproduct',finishedProductRoutes)

router.use('/itemuomconversion',ItemUomConversionRoutes)

router.use('/formulation',FormulationRoutes)

router.use('/purchasereceipt',PurchaseReceipts)

router.use('/vendoritems',VendorItems)

module.exports = router;