import { Component, Injectable, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SeasonService } from './season.service';

@Injectable()

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.css'
})

export class SeasonsComponent {
  //seasons:any[] = [];

  constructor(private service: SeasonService){}

  // ngOnInit(){
  //   this.service.getSeasons().subscribe((data) => {
  //     this.seasons = data;
  //   },
  //   (err) => {
  //     console.error('Error in fetching season data: ',err);
  //   })
  // }

  seasons = [
    { season: '2024 INDOOR', index: -1 },
    { season: '2023 OUTDOOR', index: 0 },
    { season: '2023 INDOOR', index: 1 },
    { season: '2022 OUTDOOR', index: 2 },
    { season: '2022 INDOOR', index: 3 },
    { season: '2021 OUTDOOR', index: 4 },
    { season: '2021 INDOOR', index: 5 },
    { season: '2020 OUTDOOR', index: 6 },
    { season: '2020 INDOOR', index: 7 },
    { season: '2019 OUTDOOR', index: 8 },
    { season: '2019 INDOOR', index: 9 },
    { season: '2018 OUTDOOR', index: 10 },
    { season: '2018 INDOOR', index: 11 },
    { season: '2017 OUTDOOR', index: 12 },
    { season: '2017 INDOOR', index: 13 },
    { season: '2016 OUTDOOR', index: 14 },
    { season: '2016 INDOOR', index: 15 },
    { season: '2015 OUTDOOR', index: 16 },
    { season: '2015 INDOOR', index: 17 },
    { season: '2014 OUTDOOR', index: 18 },
    { season: '2014 INDOOR', index: 19 },
    { season: '2013 OUTDOOR', index: 20 },
    { season: '2013 INDOOR', index: 21 },
    { season: '2012 OUTDOOR', index: 22 },
    { season: '2012 INDOOR', index: 23 },
    { season: '2011 OUTDOOR', index: 24 },
    { season: '2011 INDOOR', index: 25 },
    { season: '2010 OUTDOOR', index: 26 },
    { season: '2010 INDOOR', index: 27 }
  ]

  confs = [
    {
      conf: 'Div. I Combined List',
      link: 'https://tf.tfrrs.org/lists/3191/2021_NCAA_Division_I_Outdoor_Qualifying_FINAL'
    },
    {
      conf: 'Div. I East Qualifying List ',
      link: 'https://tf.tfrrs.org/lists/3192/2021_NCAA_Div_I_East_Outdoor_Qualifying_FINAL'
    },
    {
      conf: 'Div. I West Qualifying List ',
      link: 'https://tf.tfrrs.org/lists/3193/2021_NCAA_Div_I_West_Outdoor_Qualifying_FINAL'
    },
    {
      conf: 'ACC',
      link: 'https://tf.tfrrs.org/lists/3368/ACC_Outdoor_Performance_List'
    },
    {
      conf: 'ASUN',
      link: 'https://tf.tfrrs.org/lists/3378/Atlantic_Sun_Outdoor_Performance_List'
    },
    {
      conf: 'America East',
      link: 'https://tf.tfrrs.org/lists/3414/America_East_Outdoor_Performance_List'
    },
    {
      conf: 'Atlantic 10',
      link: 'https://tf.tfrrs.org/lists/3380/Atlantic_10_Outdoor_Performance_List'
    },
    {
      conf: 'BIG EAST',
      link: 'https://tf.tfrrs.org/lists/3388/BIG_EAST_Outdoor_Performance_List'
    },
    {
      conf: 'Big 12',
      link: 'https://tf.tfrrs.org/lists/3364/Big_12_Outdoor_Performance_List'
    },
    {
      conf: 'Big Sky',
      link: 'https://tf.tfrrs.org/lists/3377/Big_Sky_Outdoor_Performance_List'
    },
    {
      conf: 'Big South',
      link: 'https://tf.tfrrs.org/lists/3381/Big_South_Outdoor_Performance_List'
    },
    {
      conf: 'Big Ten',
      link: 'https://tf.tfrrs.org/lists/3367/Big_Ten_Outdoor_Performance_List'
    },
    {
      conf: 'Big West',
      link: 'https://tf.tfrrs.org/lists/3391/Big_West_Outdoor_Performance_List'
    },
    {
      conf: 'CAA',
      link: 'https://tf.tfrrs.org/lists/3386/Colonial_CAA_Outdoor_Performance_List'
    },
    {
      conf: 'Conference USA',
      link: 'https://tf.tfrrs.org/lists/3369/Conference_USA_Outdoor_Performance_List'
    },
    {
      conf: 'Horizon League',
      link: 'https://tf.tfrrs.org/lists/3371/Horizon_League_Outdoor_Performance_List'
    },
    {
      conf: 'IC4A/ECAC',
      link: 'https://tf.tfrrs.org/lists/3463/IC4A_ECAC_Outdoor_Performance_List'
    },
    {
      conf: 'MEAC',
      link: 'https://tf.tfrrs.org/lists/3382/Mid_Eastern_MEAC_Outdoor_Performance_List'
    },
    {
      conf: 'Metro Atlantic',
      link: 'https://tf.tfrrs.org/lists/3399/Metro_Atlantic_MAAC_Outdoor_Performance_List'
    },
    {
      conf: 'Mid-American',
      link: 'https://tf.tfrrs.org/lists/3374/Mid_American_MAC_Outdoor_Performance_List'
    },
    {
      conf: 'Missouri Valley',
      link: 'https://tf.tfrrs.org/lists/3372/Missouri_Valley_MVC_Outdoor_Performance_List'
    },
    {
      conf: 'Mountain West',
      link: 'https://tf.tfrrs.org/lists/3383/Mountain_West_Outdoor_Performance_List'
    },
    {
      conf: 'NEC',
      link: 'https://tf.tfrrs.org/lists/3395/Northeast_Conference_Outdoor_Performance_List'
    },
    {
      conf: 'Ohio Valley',
      link: 'https://tf.tfrrs.org/lists/3379/Ohio_Valley_OVC_Outdoor_Performance_List'
    },
    {
      conf: 'Pac-12',
      link: 'https://tf.tfrrs.org/lists/3384/Pac_12_Outdoor_Performance_List'
    },
    {
      conf: 'Patriot League',
      link: 'https://tf.tfrrs.org/lists/3385/Patriot_League_Outdoor_Performance_List'
    },
    {
      conf: 'SEC',
      link: 'https://tf.tfrrs.org/lists/3375/SEC_Outdoor_Performance_List'
    },
    {
      conf: 'SWAC',
      link: 'https://tf.tfrrs.org/lists/3370/SWAC_Outdoor_Performance_List'
    },
    {
      conf: 'Southern Conference',
      link: 'https://tf.tfrrs.org/lists/3376/Southern_Conference_Outdoor_Performance_List'
    },
    {
      conf: 'Southland Conference',
      link: 'https://tf.tfrrs.org/lists/3365/Southland_Conference_Outdoor_Performance_List'
    },
    {
      conf: 'Sun Belt',
      link: 'https://tf.tfrrs.org/lists/3366/Sun_Belt_Outdoor_Performance_List'
    },
    {
      conf: 'The American',
      link: 'https://tf.tfrrs.org/lists/3373/The_American_Outdoor_Performance_List'
    },
    {
      conf: 'The Summit League',
      link: 'https://tf.tfrrs.org/lists/3331/The_Summit_League_Outdoor_Performance_List'
    },
    {
      conf: 'WAC',
      link: 'https://tf.tfrrs.org/lists/3387/WAC_Outdoor_Performance_List'
    },
    {
      conf: 'Outdoor Qualifying List',
      link: 'https://tf.tfrrs.org/lists/3194/2021_NCAA_Division_II_Outdoor_Qualifying_FINAL'
    },
    {
      conf: 'DII Atlantic Region',
      link: 'https://tf.tfrrs.org/lists/3443/DII_Atlantic_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DII Central Region',
      link: 'https://tf.tfrrs.org/lists/3444/DII_Central_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DII East Region',
      link: 'https://tf.tfrrs.org/lists/3445/DII_East_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DII Midwest Region',
      link: 'https://tf.tfrrs.org/lists/3446/DII_Midwest_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DII South Central Region',
      link: 'https://tf.tfrrs.org/lists/3447/DII_South_Central_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DII South Region',
      link: 'https://tf.tfrrs.org/lists/3448/DII_South_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DII Southeast Region',
      link: 'https://tf.tfrrs.org/lists/3449/DII_Southeast_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DII West Region',
      link: 'https://tf.tfrrs.org/lists/3450/DII_West_Region_Outdoor_Performance_List'
    },
    {
      conf: 'CACC',
      link: 'https://tf.tfrrs.org/lists/3456/CACC_Outdoor_Performance_List'
    },
    {
      conf: 'Conference Carolinas',
      link: 'https://tf.tfrrs.org/lists/3336/Conference_Carolinas_Outdoor_Performance_List'
    },
    {
      conf: 'ECC',
      link: 'https://tf.tfrrs.org/lists/3349/ECC_Outdoor_Performance_List'
    },
    {
      conf: 'GLIAC',
      link: 'https://tf.tfrrs.org/lists/3332/GLIAC_Outdoor_Performance_List'
    },
    {
      conf: 'GLVC',
      link: 'https://tf.tfrrs.org/lists/3344/GLVC_Outdoor_Performance_List'
    },
    {
      conf: 'GNAC',
      link: 'https://tf.tfrrs.org/lists/3345/GNAC_Outdoor_Performance_List'
    },
    {
      conf: 'Great American',
      link: 'https://tf.tfrrs.org/lists/3347/Great_American_Outdoor_Performance_List'
    },
    {
      conf: 'Great Midwest',
      link: 'https://tf.tfrrs.org/lists/3338/Great_Midwest_Outdoor_Performance_List'
    },
    {
      conf: 'Gulf South',
      link: 'https://tf.tfrrs.org/lists/3341/Gulf_South_Outdoor_Performance_List'
    },
    {
      conf: 'Lone Star',
      link: 'https://tf.tfrrs.org/lists/3340/Lone_Star_Outdoor_Performance_List'
    },
    {
      conf: 'MIAA',
      link: 'https://tf.tfrrs.org/lists/3337/MIAA_Outdoor_Performance_List'
    },
    {
      conf: 'Mountain East',
      link: 'https://tf.tfrrs.org/lists/3348/Mountain_East_Outdoor_Performance_List'
    },
    {
      conf: 'Northeast-10',
      link: 'https://tf.tfrrs.org/lists/3454/Northeast_10_Outdoor_Performance_List'
    },
    {
      conf: 'Northern Sun',
      link: 'https://tf.tfrrs.org/lists/3342/Northern_Sun_Outdoor_Performance_List'
    },
    {
      conf: 'PSAC',
      link: 'https://tf.tfrrs.org/lists/3393/PSAC_Outdoor_Performance_List'
    },
    {
      conf: 'PacWest',
      link: 'https://tf.tfrrs.org/lists/3350/PacWest_Outdoor_Performance_List'
    },
    {
      conf: 'Peach Belt',
      link: 'https://tf.tfrrs.org/lists/3346/Peach_Belt_Outdoor_Performance_List'
    },
    {
      conf: 'RMAC',
      link: 'https://tf.tfrrs.org/lists/3339/RMAC_Outdoor_Performance_List'
    },
    {
      conf: 'South Atlantic',
      link: 'https://tf.tfrrs.org/lists/3343/South_Atlantic_Outdoor_Performance_List'
    },
    {
      conf: 'Outdoor Qualifying List',
      link: 'https://tf.tfrrs.org/lists/3195/2021_NCAA_Division_III_Outdoor_Qualifying_FINAL'
    },
    {
      conf: 'DIII Great Lakes Region',
      link: 'https://tf.tfrrs.org/lists/3438/DIII_Great_Lakes_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DIII Mid-Atlantic Region',
      link: 'https://tf.tfrrs.org/lists/3439/DIII_Mideast_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DIII Midwest Region',
      link: 'https://tf.tfrrs.org/lists/3440/DIII_Midwest_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DIII Niagara Region',
      link: 'https://tf.tfrrs.org/lists/3436/DIII_Atlantic_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DIII North Region',
      link: 'https://tf.tfrrs.org/lists/3437/DIII_Central_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DIII South Region',
      link: 'https://tf.tfrrs.org/lists/3441/DIII_South_SE_Region_Outdoor_Performance_List'
    },
    {
      conf: 'DIII West Region',
      link: 'https://tf.tfrrs.org/lists/3442/DIII_West_Region_Outdoor_Performance_List'
    },
    {
      conf: 'AARTFC',
      link: 'https://tf.tfrrs.org/lists/3459/AARTFC_Outdoor_Performance_List'
    },
    {
      conf: 'American Rivers Conference',
      link: 'https://tf.tfrrs.org/lists/3353/American_Rivers_Outdoor_Performance_List'
    },
    {
      conf: 'Atlantic East',
      link: 'https://tf.tfrrs.org/lists/3432/Atlantic_East_Outdoor_Performance_List'
    },
    {
      conf: 'CCIW',
      link: 'https://tf.tfrrs.org/lists/3358/CCIW_Outdoor_Performance_List'
    },
    {
      conf: 'CSAC',
      link: 'https://tf.tfrrs.org/lists/3462/Colonial_States_Outdoor_Performance_List'
    },
    {
      conf: 'Centennial Conference',
      link: 'https://tf.tfrrs.org/lists/3431/Centennial_Conference_Outdoor_Performance_List'
    },
    {
      conf: 'Coast-to-Coast',
      link: 'https://tf.tfrrs.org/lists/3396/Coast_to_Coast_Outdoor_Performance_List'
    },
    {
      conf: 'DIII New England',
      link: 'https://tf.tfrrs.org/lists/3451/DIII_New_England_Region_Outdoor_Performance_List'
    },
    {
      conf: 'Empire 8 ',
      link: 'https://tf.tfrrs.org/lists/3360/Empire_8_Outdoor_Performance_List'
    },
    {
      conf: 'HCAC',
      link: 'https://tf.tfrrs.org/lists/3333/HCAC_Outdoor_Performance_List'
    },
    {
      conf: 'Landmark Conference',
      link: 'https://tf.tfrrs.org/lists/3430/Landmark_Conference_Outdoor_Performance_List'
    },
    {
      conf: 'Liberty League',
      link: 'https://tf.tfrrs.org/lists/3453/Liberty_League_Outdoor_Performance_List'
    },
    {
      conf: 'Little East',
      link: 'https://tf.tfrrs.org/lists/3397/Little_East_Outdoor_Performance_List'
    },
    {
      conf: 'MASCAC',
      link: 'https://tf.tfrrs.org/lists/3457/MASCAC_Outdoor_Performance_List'
    },
    {
      conf: 'MIAC',
      link: 'https://tf.tfrrs.org/lists/3354/MIAC_Outdoor_Performance_List'
    },
    {
      conf: 'Michigan Intercollegiate AA',
      link: 'https://tf.tfrrs.org/lists/3356/Michigan_Intercollegiate_Outdoor_Performance_List'
    },
    {
      conf: 'Middle Atlantic Conferences',
      link: 'https://tf.tfrrs.org/lists/3398/Middle_Atlantic_Conferences_Outdoor_List'
    },
    {
      conf: 'Midwest Conference',
      link: 'https://tf.tfrrs.org/lists/3392/Midwest_Conference_Outdoor_Performance_List'
    },
    {
      conf: 'NACC',
      link: 'https://tf.tfrrs.org/lists/3433/NACC_Outdoor_Performance_List'
    },
    {
      conf: 'NEICAAA',
      link: 'https://tf.tfrrs.org/lists/3452/NEICAAA_Outdoor_Performance_List'
    },
    {
      conf: 'NESCAC',
      link: 'https://tf.tfrrs.org/lists/3461/NESCAC_Outdoor_Performance_List'
    },
    {
      conf: 'NEWMAC',
      link: 'https://tf.tfrrs.org/lists/3460/NEWMAC_Outdoor_Performance_List'
    },
    {
      conf: 'NJAC',
      link: 'https://tf.tfrrs.org/lists/3455/NJAC_Outdoor_Performance_List'
    },
    {
      conf: 'North Coast AC',
      link: 'https://tf.tfrrs.org/lists/3352/North_Coast_AC_Outdoor_Performance_List'
    },
    {
      conf: 'Northwest Conference',
      link: 'https://tf.tfrrs.org/lists/3335/Northwest_Conference_Outdoor_Performance_List'
    },
    {
      conf: 'ODAC',
      link: 'https://tf.tfrrs.org/lists/3351/ODAC_Outdoor_Performance_List'
    },
    {
      conf: 'Ohio Athletic Conference',
      link: 'https://tf.tfrrs.org/lists/3355/Ohio_Athletic_Conference_Outdoor_Performance_List'
    },
    {
      conf: 'Presidents AC',
      link: 'https://tf.tfrrs.org/lists/3361/Presidents_Athletic_Conference_Performance_List'
    },
    {
      conf: 'SCAC',
      link: 'https://tf.tfrrs.org/lists/3400/SCAC_Outdoor_Performance_List'
    },
    {
      conf: 'SCIAC',
      link: 'https://tf.tfrrs.org/lists/3429/SCIAC_Outdoor_Performance_List'
    }
  ]
}
