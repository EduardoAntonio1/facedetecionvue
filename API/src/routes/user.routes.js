import { Router } from "express"
import * as userCtrl from '../controllers/user.controller'
import {authJwt,verifySingup} from '../middlewares'

const router = Router();

router.post('/',[
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySingup.checkRolesExisted
],userCtrl.createUser)

export default router;