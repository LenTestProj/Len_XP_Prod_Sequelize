const {Op} = require("sequelize");
const {Users,AdminRoles,AdminPermissions,AdminRolePermissions} = require("../models");

//find User by email
const findUserByEmail = async(email) => {
    return await Users.findOne({
        where:{
            email
        },
        attributes:[
            "id",
            "organization_id",
            "name",
            "email",
            "mobile",
            "password",
            "passwordExpiry",
            "status",
            "role_id"
        ],
        include:[
            {
                model:AdminRoles,
                as:"role",
                attributes:[
                    "id",
                    "name",
                    "description",
                    "status"
                ],
                where:{
                    is_deleted:false
                },
                requried:true,
                include:[
                    {
                        model:AdminRolePermissions,
                        attributes:[
                            "id",
                            "permission_id"
                        ],
                        required:false,
                        include:[
                            {
                                model:AdminPermissions,
                                required:true,
                                where:{
                                    is_deleted:false
                                },
                                attributes:[
                                    "id",
                                    "module_name",
                                    "permission_key",
                                    "permission_name"
                                ],
                                as:"permission"
                            }
                        ],
                        as:"rolePermissions",
                    }
                ]
            }
        ]
    })
};

const findUserByMobile = async(mobile) => {
    return await Users.findOne({
        where:{
            mobile,
            is_deleted:false
        }
    })
}

const findRoleById = async(roleId) => {
    return await AdminRoles.findOne({
        where:{
            id:roleId,
            status:"active",
            is_deleted:false
        }
    })
}

const getUserPermissions = async(userId) => {
    const user = await Users.findOne({
        where:{
            id:userId,
            is_deleted:false
        },
        include:[
            {
                model: AdminRoles,
                as: 'role',
                include:[
                    {
                        model: AdminPermissions,
                        as:"permissions",
                        through:{
                            attributes: []
                        },
                        attributes:[
                            "id",
                            "permission_key",
                            "permission_name",
                            "module_name"
                        ]
                    }
                ]
            }
        ]
    });
    return user;
}

const findUserById = async(id) => {
    return await Users.findOne({
        where:{
            id,
            is_deleted:false
        },
        include:[
            {
                model:AdminRoles,
                as:"role",
                attributes:[
                    "id",
                    "name",
                    "status"
                ]
            }
        ]
    })
}

const saveOtp = async (userId, otp, expiry) => {
    return await Users.update(
        {
            reset_otp:otp,
            reset_otp_expiry:expiry
        },
        {
            where:{
                id:userId
            }
        }
    )
};

const verifyOtpForUser = async (email, otp) => {
    return await Users.findOne({
        where:{
            email,
            reset_otp:otp,
            reset_otp_expiry:{
                [Op.gt]:new Date()
            },
            is_deleted:false
        }
    })
}

const clearOtp = async(userId) => {
    return await Users.update(
        {
            reset_otp:null,
            reset_otp_expiry:null
        },
        {
            where: {
                id:userId
            }
        }
    )
};

//Update Password
const updatePassword = async(userId,payload) => {
    return await Users.update(
        payload,
        {
            where:{
                id:userId
            }
        }
    )
}

const updateLastLogin = async (userId) => {
    return await Users.update(
        {
            last_login: new Date(),
        },
        {
            where:{
                id:userId
            }
        }
    )
}

moddule.exports = {
    findUserByEmail,

    findUserByMobile,

    findRoleById,

    // createUser,

    findUserById,
    getUserPermissions,


    saveOtp,

    verifyOtpForUser,

    clearOtp,

    updatePassword,

    updateLastLogin,
}