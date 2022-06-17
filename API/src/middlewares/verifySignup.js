import {ROLES} from '../models/rol'
import User from '../models/users'

export const checkDuplicateUserNameOrEmail = async (req,res,next) =>{
    const user = await User.findOne({username: req.body.username});

    if (user) return res.status(400).json({message: "The user alredy exists"})

    const email = await User.findOne({email: req.body.email});

    if (email) return res.status(400).json({message: "The email alredy exists"})
    next();
}

export const checkRolesExisted = (req,res,next)=>{
    if(req.body.roles){
        for (let i = 0; i<req.body.roles.length;i++){
            if (!ROLES.includes(req.body.roles[i])){
                res.status(400).json({message: `Role ${req.body.roles[i]} does not exists`});
            }
        }
    }
    next();
}