import { Router } from 'express'
import * as authCtrl from '../controllers/auth.controller'
import {verifySingup} from '../middlewares'

const router = Router();

router.post('/signup',[
    verifySingup.checkDuplicateUserNameOrEmail,
    verifySingup.checkRolesExisted
],authCtrl.signup);
router.post('/signin',authCtrl.signin);

export default router;