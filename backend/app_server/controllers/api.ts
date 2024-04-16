import { NextFunction, Request, Response } from "express";
import Season from '../models/season.model'
import Scraper from '../../../web-scraper/index.js'

export default class ApiCtrl {

    base = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({
            message: "Default Response"
        })
    }

    getSeasons = async (req: Request, res: Response, next: NextFunction) => {
        let myPromise: Promise<any[]> = Scraper.scrapeSeasons();
        myPromise.then(
            (seasArr) => {
                if(seasArr === undefined) {
                    seasArr = [];
                }
                res.status(201).json({seasons: seasArr});
            },
            (err) => {res.status(400), err}
        )
    }
}