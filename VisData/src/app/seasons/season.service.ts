import { Injectable, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, from } from "rxjs";
import * as  scraperFunctions from '../../../../web-scraper/index.js'

export interface seasonObj {
    season: string,
    index: number,
}



@Injectable({providedIn: 'root',})

export class SeasonService {
    seasons:Array<seasonObj> = [];

    constructor(){}

    //getSeasons(): Observable<any[]> {
        //return from(scraperFunctions.scrapeSeasons());
    //}
}