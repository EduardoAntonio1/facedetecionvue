import User from '../models/users'
import jwt from 'jsonwebtoken'
import config from '../config'
import Role from '../models/rol'

export const signup = async (req, res) =>{
    const {username,email,password,roles}=req.body;

    const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password)
    })

    if(roles){
        const foundRoles = await Role.find({name:{$in:roles}});
        newUser.roles = foundRoles.map(role => role._id)
    }
    else{
        const role = await Role.findOne({name:"user"});
        newUser.roles = [role._id];
    }

    const saveUser = await newUser.save();
    console.log(saveUser)

    const token = jwt.sign({id:saveUser._id},config.SECRET,{
        expiresIn: 86400 // 24 hours
    })

    res.json({token});
}

export const signin = async (req, res) =>{
    
    const userFound = await User.findOne({email: req.body.email}).populate("roles");
    
    if (!userFound) return res.json({message:"User not found"});

    const matchPassword = await User.comparePassword(req.body.password,userFound.password)

    if(!matchPassword)return res.json({token:null,message:"user invalid"})

    const token = jwt.sign({id:userFound._id},config.SECRET,{
        expiresIn: 86400 // 24 hours
    })

    res.json({token});
}