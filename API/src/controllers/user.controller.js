import * as authCtrl from "./auth.controller"

export const createUser = (req,res) =>{
    authCtrl.signup(req,res);
}