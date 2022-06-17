import { Router } from "express"
import * as personCtrl from '../controllers/person.controller'
import {authJwt} from '../middlewares'
import * as imgCtrl from '../controllers/img.controller'

const router = Router();

router.get('/',personCtrl.getPerson);

router.post('/',imgCtrl.upload.array('files'),personCtrl.insertPerson);

export default router;