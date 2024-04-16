import { NextFunction, Request, Response } from "express";
import Season from '../models/season.model'
import Scraper from '../../../web-scraper/index.js'
import fs from 'fs'

export default class ApiCtrl {

    private path = "../../../web-scraper/index.js";

    private scrapedSeasons: Array<Season> | undefined;

    base = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({
            message: "Default Response"
        })
    }

    getSeasons = async (req: Request, res: Response, next: NextFunction) => {
        let myPromise = Scraper.scrapeSeasons() || undefined;
        myPromise.then(
            (seasArr:Array<Season>) => {
                if(seasArr === undefined) {
                    seasArr = [{season: "missing", index: -1}];
                }
                res.status(201).json({seasons: seasArr});
            }).catch(
            (err:Error) => {res.status(400), err}
        )
    }
}