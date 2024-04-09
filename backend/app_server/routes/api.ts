import express from 'express';
import ApiCtrl from '../controllers/api';

const router = express.Router();
const apiCtrl = new ApiCtrl();

/* GET users listing. */
router.get('/', apiCtrl.getSeasons);

export class apiRouter {

}