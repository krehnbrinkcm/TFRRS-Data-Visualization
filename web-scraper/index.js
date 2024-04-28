//importing cheerio and axios

const cheerio = require("cheerio")
const axios = require("axios")
//const links = require('./links');

//scrapes seasons from TFFRS archive (index 0 - ...) + the current season (index -1)
async function scrapeSeasons() {

    //get archives page
    const axiosResponseArchives = await axios.request({
        method: "GET",
        url: "https://tf.tfrrs.org/archives.html",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    //parse HTML using Cheerio
    const $ = cheerio.load(axiosResponseArchives.data);

    //array that will hold season objects (season name / link)
    const seasonArray = [];

    //fill athlete array
    var index = 0;
    $(".nav.nav-tabs.mr-25")
        .find(".nav-item")
        .each((index, element) => {
            const season = $(element).find("a:eq(0)").text().trim();

            const seasonObj = {
                season: season,
                index: index
            }

            if (index == 0) {

                var year = parseInt((seasonObj.season.substring(0,4)));

                if (seasonObj.season.endsWith("OUTDOOR")) {
                    year++;
                    var seas = "INDOOR"
                    var seasString = year + " " + seas
                }

                else {
                    var seas = "OUTDOOR"
                    var seasString = year + " " + seas;
                }

                const curObj = {
                    season: seasString,
                    index: -1
                }
                seasonArray.push(curObj)
            }

            seasonArray.push(seasonObj)
            index++;
        })


    console.log (seasonArray) //change to return 

    
        //localStorage.setItem("seasons", JSON.stringify(seasonArray));
    //return 1//change to return 

}

//scrapes the conferences from each season
async function scrapeConfs(index) {

    beginLink = "https://tf.tfrrs.org"

    //get archives page
    const axiosResponseArchives = await axios.request({
        method: "GET",
        url: "https://tf.tfrrs.org/archives.html",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    //parse HTML using Cheerio
    const $ = cheerio.load(axiosResponseArchives.data);

    //array that will hold conference objects (conference name / link)
    var confArray = [];

    for (let i = -1; i < 28; i++) {
    //fill conference array
    const test = $(".tab-content.py-15")
        .find(".tab-pane:eq(" + i + ")")
        .find("turbo-frame")
        .attr("src")

    //navigate to seperate season page
    const axiosResponseConfsPage = await axios.request({
        method: "GET",
        url: beginLink + test,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    //parse HTML using Cheerio
    const $2 = cheerio.load(axiosResponseConfsPage.data);

    $2("turbo-frame:eq(1)").find(".row").find("ul")
        .each((i, element) => {
            $(element).find("li").each((i, element2) => {

                var conf = $(element2).find("a").text().replace('data-','');
                var link = $(element2).find("a").attr("href")

                const confObj = {
                    conf: conf,
                    link: link
                }

                confArray.push(confObj)
            })
        })
    }
    console.log (JSON.stringify(confArray, null, 2))

}

//scrapes a season-conference performance list page (Ex. 2023 Outdoor Performance List)
//current goal - change to scrape just a specific event from a performance list
async function scrapeConfPerformanceList(link) {

    // download conf performance list
    const axiosResponse = await axios.request({
        method: "GET",
        url: link,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    //parse HTML using Cheerio
    const $ = cheerio.load(axiosResponse.data);

    //array test to scrape names
    const athleteArray = []

    //fill athlete array
    $(".panel-body").find(".row").each((index, element2) => {
        const event = $(element2).find(".font-weight-500").text().trim()
        $(element2).find(".body")
            .find(".allRows")
            .each((index, element) => {
                const rank = $(element).find("td:eq(0)").text().trim();
                const name = $(element).find("td:eq(1)").text().trim();
                const year = $(element).find("td:eq(2)").text().trim();
                const team = $(element).find("td:eq(3)").text().trim();
                const time = $(element).find("td:eq(4)").text().trim();
                const meet = $(element).find("td:eq(5)").text().trim();
                const meetDate = $(element).find("td:eq(6)").text().trim();
                const wind = $(element).find("td:eq(7)").text().trim();

                const athlete = {
                    event: event,
                    rank: rank,
                    name: name,
                    year: year,
                    team: team,
                    value: time,
                    meet: meet,
                    meetDate: meetDate,
                    wind: wind
                }

                athleteArray.push(athlete)
            })
    })


    console.log(athleteArray)
}

async function scrapeConfEvent(link,ev) {

    // download conf performance list
    const axiosResponse = await axios.request({
        method: "GET",
        url: link,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    //parse HTML using Cheerio
    const $ = cheerio.load(axiosResponse.data);

    //array test to scrape names
    const athleteArray = []

    //fill athlete array
    $(".panel-body").find(".row:eq(" + ev + ")").each((index, element2) => {
        const event = $(element2).find(".font-weight-500").text().trim()
        $(element2).find(".body")
            .find(".allRows")
            .each((index, element) => {
                const rank = $(element).find("td:eq(0)").text().trim();
                const name = $(element).find("td:eq(1)").text().trim();
                const year = $(element).find("td:eq(2)").text().trim();
                const team = $(element).find("td:eq(3)").text().trim();
                const time = $(element).find("td:eq(4)").text().trim();
                const meet = $(element).find("td:eq(5)").text().trim();
                const meetDate = $(element).find("td:eq(6)").text().trim();
                const wind = $(element).find("td:eq(7)").text().trim();

                const athlete = {
                    event: event,
                    rank: rank,
                    name: name,
                    year: year,
                    team: team,
                    time: time,
                    meet: meet,
                    meetDate: meetDate,
                    wind: wind
                }

                athleteArray.push(athlete)
            })
    })


    console.log(athleteArray)
}

const links =
[
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/502/2009_2010_NCAA_Div_I_Indoor_POP_List_FINAL"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/506/Atlantic_Sun_Conference_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/479/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/481/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/482/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/483/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/484/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/485/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/488/Mountain_Pacific_Sports_Federation_Indoor_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/486/Metro_Atlantic_Athletic_Conference_MAAC_Indoor"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/513/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/487/Missouri_Valley_Conference_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/489/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/492/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/491/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/490/Ohio_Valley_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/493/Patriot_League_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/494/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/495/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/503/2009_2010_NCAA_Div_II_Indoor_POP_List_Final"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/509/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/515/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/513/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/491/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/508/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/507/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/499/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/504/2009_10_NCAA_Division_III_Indoor_Track__Field"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/496/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/498/DIII_New_England_Indoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/497/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/501/Empire_Eight_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/512/Heartland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/513/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/491/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/500/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/476/2009_2010_NAIA_Indoor_POP_List_Final_Closed"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/514/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/478/2009_2010_NJCAA_Indoor_Performance_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4044/2023_NCAA_Division_I_All_Schools_Rankings"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4162/2023_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4163/2023_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DI Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4202/DI_Great_Lakes_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4203/DI_Mid_Atlantic_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4204/DI_Midwest_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Mountain Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4205/DI_Mountain_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Northeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4206/DI_Great_Lakes_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4208/DI_South_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4207/DI_South_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4209/DI_Southeast_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4210/DI_West_Region_Outdoor_Performance_List"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4280/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4277/ASUN_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4279/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4278/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4296/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4231/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4281/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4282/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4229/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4228/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4224/CAA_Colonial_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4230/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4283/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4295/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4276/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4285/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4289/Metro_Atlantic_MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4284/Mid_American_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4291/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4233/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4287/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4294/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4292/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4232/Pac_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4225/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4286/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4223/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4290/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4275/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4227/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4226/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4293/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4288/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4045/2023_NCAA_Division_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4154/DII_Atlantic_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4155/DII_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4156/DII_East_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4157/DII_Midwest_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4158/DII_South_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4159/DII_South_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4160/DII_Southeast_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4161/DII_West_Region_Outdoor_Performance_List"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4191/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4180/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4181/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4182/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4183/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4184/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4199/Great_American_Outdoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4196/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4198/Gulf_South_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4189/Lone_Star_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4185/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4299/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4195/Mountain_East_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4294/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4186/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4187/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4179/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4192/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4193/Peach_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4188/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "SIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4190/SIAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4197/South_Atlantic_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4043/2023_NCAA_Division_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4213/DIII_Great_Lakes_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4214/DIII_Mid_Atlantic_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4215/DIII_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4211/DIII_Niagara_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4212/DIII_North_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4219/DIII_South_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4217/DIII_West_Region_Outdoor_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4268/AARTFC_Outdoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4248/American_Rivers_Outdoor_Performance_List"
  },
  {
    "conf": "American Southwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4237/American_Southwest_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4270/Atlantic_East_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4246/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4267/CSAC_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4242/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4245/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4244/Coast_to_Coast_Outdoor_Performance_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4239/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4241/DIII_New_England_Outdoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4300/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4247/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4243/HCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4249/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4250/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "Little Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4251/Little_East_Outdoor_Performance_List"
  },
  {
    "conf": "MASCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4252/MASCAC_Outdoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4254/MIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4299/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4238/Michigan_Intercollegiate_Outdoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4253/Middle_Atlantic_Conference_Outdoor_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4274/Midwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4258/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4294/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4240/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NEWMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4255/NEWMAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4256/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "North Atlantic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4269/North_Atlantic_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4257/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4222/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4260/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4259/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4261/Presidents_AC_Outdoor_Performance_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4235/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4234/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4265/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4262/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4236/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4263/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4264/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "USA Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4271/USA_South_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4266/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4046/2023_NAIA_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4174/American_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4176/Appalachian_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4171/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4175/Crossroads_League_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4168/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4165/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4164/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4169/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4172/Mid_South_Outdoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4173/North_Star_Outdoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4177/River_States_Outdoor_Performance_List"
  },
  {
    "conf": "Southern States ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4298/Southern_States_AC_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4167/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4170/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4201/NJCAA_All_Schools_Outdoor_Performance_List"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4055/2023_NJCAA_DI_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4056/2023_NJCAA_DIII_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4047/2023_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4048/2023_NWAC_Outdoor_Track__Field_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4049/2023_USCAA_Outdoor_Track__Field_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3901/2022_2023_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3913/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3946/ASUN_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3949/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3948/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3970/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3947/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3950/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3951/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3952/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3953/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3954/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4027/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3943/Ivy_League_Conference_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3956/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4034/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3963/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3968/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3955/Mid_American_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3965/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3945/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3958/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4026/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3966/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3962/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3957/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3959/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3964/_Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3942/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3960/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3969/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3967/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3961/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3902/2022_2023_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3923/DII_Atlantic_Region_Indoor_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3924/DII_Central_Region_Indoor_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3925/DII_East_Region_Indoor_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3926/DII_Midwest_Region_Indoor_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3927/DII_South_Central_Region_Indoor_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3928/DII_South_Region_Indoor_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3929/DII_Southeast_Region_Indoor_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3930/DII_West_Region_Indoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3971/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3972/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "ECCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3981/ECC_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3973/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3974/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3975/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3983/Great_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3985/Gulf_South_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3980/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3976/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3968/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3982/Mountain_East_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4026/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3977/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3979/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3912/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3978/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3984/South_Atlantic_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3903/2022_2023_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3933/DIII_Great_Lakes_Region_Indoor_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3934/DIII_Mid_Atlantic_Region_Indoor_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3935/DIII_Midwest_Region_Indoor_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3931/DIII_Niagara_Region_Indoor_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3932/DIII_North_Region_Indoor_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3936/DIII_South_Region_Indoor_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3937/DIII_West_Region_Indoor_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3998/AARTFC_Indoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4010/American_Rivers_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4003/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4000/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3999/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4002/Coast_to_Coast_Indoor_Performance_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4035/DIII_All_Ohio_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4008/DIII_New_England_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4009/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4001/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4011/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4005/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "Little Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4012/Little_East_Indoor_Performance_List"
  },
  {
    "conf": "MASCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4013/MASCAC_Indoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4016/MIAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3968/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4014/Michigan_Intercollegiate_Indoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4006/Middle_Atlantic_Conference_Indoo_Performance_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4015/Midwest_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4017/NACC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4026/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3939/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4004/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4018/Northwest_Conference_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3911/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4019/OAC_Indoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4020/Presidents_AC_Indoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4024/SLIAC_Indoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4007/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4021/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4022/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/4023/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3904/2022_2023_NAIA_Indoor_Qualifying_List_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3993/American_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3995/Appalachian_AC_Indoor_Performance_List"
  },
  {
    "conf": "Chicagoland Collegiatemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3997/Chicagoland_Collegiate_Indoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3994/Crossroads_League_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3987/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3986/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3989/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3991/Mid_South_Indoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3992/North_Star_Indoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3996/River_States_Indoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3988/The_Sun_Conference_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3990/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3905/2022_2023_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3906/2022_2023_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3711/2022_NCAA_Division_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3712/2022_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3713/2022_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DI Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3783/DI_Great_Lakes_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3784/DI_Mid_Atlantic_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3785/DI_Midwest_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Mountain Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3786/DI_Mountain_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Northeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3787/DI_Northeast_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3789/DI_South_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3788/DI_South_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3790/DI_Southeast_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DI West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3791/DI_West_Region_Outdoor_Performance_List"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3861/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3841/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3871/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3858/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3857/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3843/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3866/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3844/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3867/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3782/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3845/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3854/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3855/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3873/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3863/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3846/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3870/Metro_Atlantic_MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3868/Mid_American_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3856/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3859/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3869/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3872/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3852/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3847/Pac_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3864/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3862/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3848/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3851/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3842/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3849/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3853/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3865/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3850/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3595/2022_NCAA_Division_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3772/DII_Atlantic_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3773/DII_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3774/DII_East_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3775/DII_Midwest_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3776/DII_South_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3777/DII_South_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3778/DII_Southeast_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3779/DII_West_Region_Outdoor_Performance_List"
  },
  {
    "conf": "CACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3780/CACC_Outdoor_Performance_List"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3750/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3752/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3753/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "ECCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3765/ECC_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3754/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3755/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3756/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3770/Great_American_Conference_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3767/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3769/Gulf_South_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3761/Lone_Star_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3757/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3766/Mountain_East_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3758/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3759/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3751/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3763/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3764/Peach_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3760/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "SIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3762/SIAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3771/South_Atlantic_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3714/2022_NCAA_Division_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3800/DIII_East_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3794/DIII_Great_Lakes_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Metro Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3799/DIII_Metro_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3795/DIII_Mid_Atlantic_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Mideast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3801/DIII_Mideast_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3796/DIII_Midwest_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3792/DIII_Niagara_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3793/DIII_North_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3797/DIII_South_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3798/DIII_West_Region_Outdoor_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3836/AARTFC_Outdoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3811/American_Rivers_Outdoor_Performance_List"
  },
  {
    "conf": "American Southwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3860/American_Southwest_Conference_Performance_List"
  },
  {
    "conf": "Atlantic Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3838/Atlantic_East_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3809/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3835/CSAC_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3805/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3808/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3807/Coast_to_Coast_Outdoor_Performance_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3832/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3803/DIII_New_England_Outdoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3882/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3810/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "Great Northeast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3840/Great_Northeast_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3806/HCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3812/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3813/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "Little Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3814/Little_East_Outdoor_Performance_List"
  },
  {
    "conf": "MASCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3816/MASCAC_Outdoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3819/MIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3815/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3817/Middle_Atlantic_Conferenc_Outdoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3818/Midwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3823/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3872/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3802/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NEWMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3820/NEWMAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3821/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "North Atlantic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3837/North_Atlantic_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3822/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3824/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3826/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3825/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3827/Presidents_AC_Outdoor_Performance_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3804/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3781/SCIAC_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3833/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3828/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3834/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3829/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3830/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "USA Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3839/USA_South_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3831/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3596/2022_NAIA_Outdoor_Qualifying_List_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3740/American_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3742/Appalachian_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3737/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Chicagoland Collegiatemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3744/Chicagoland_Collegiate_Outdoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3741/Crossroads_League_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3734/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3732/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3731/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3735/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3738/Mid_South_Outdoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3739/North_Star_Outdoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3743/River_States_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3733/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3736/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3717/NJCAA_All_Schools_Outdoor_Performance_List"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3748/2022_NJCAA_DI_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3749/2022_NJCAA_DIII_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3715/2022_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3716/2022_NWAC_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3881/USCAA_Outdoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3492/2021_2022_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DI Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3598/DI_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DI Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3599/DI_Mid_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DI Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3600/DI_Midwest_Region_Performance_List"
  },
  {
    "conf": "DI Mountain Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3601/DI_Mountain_Region_Performance_List"
  },
  {
    "conf": "DI Northeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3602/DI_Northeast_Region_Performance_List"
  },
  {
    "conf": "DI South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3604/DI_South_Central_Region_Performance_List"
  },
  {
    "conf": "DI South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3603/DI_South_Region_Performance_List"
  },
  {
    "conf": "DI Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3605/DI_Southeast_Region_Performance_List"
  },
  {
    "conf": "DI West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3606/DI_West_Region_Performance_List"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3522/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3517/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3521/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3520/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3543/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3519/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3523/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3524/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3525/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3526/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3527/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3593/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3516/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3529/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3531/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3537/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3594/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3528/Mid_American_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3539/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3518/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3532/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3588/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3540/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3592/Pac_12_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3536/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3530/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3533/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3538/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3513/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3534/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3542/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3541/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3535/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3493/2021_2022_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3607/DII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3608/DII_Central_Region_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3609/DII_East_Region_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3610/DII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3611/DII_South_Central_Region_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3612/DII_South_Region_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3613/DII_Southeast_Region_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3614/DII_West_Region_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3544/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3545/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "ECCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3554/ECC_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3546/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3547/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3548/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3556/Great_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3558/Gulf_South_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3553/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3549/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3555/Mountain_East_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3588/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3550/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3551/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3514/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3552/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3557/South_Atlantic_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3494/2021_2022_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3615/DIII_East_Region_Performance_List"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3620/DIII_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DIII Metro Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3617/DIII_Metro_Region_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3619/DIII_Mid_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DIII Mideast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3616/DIII_Mideast_Region_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3623/DIII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3618/DIII_Niagara_Region_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3622/DIII_North_Region_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3621/DIII_South_Region_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3624/DIII_West_Region_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3586/AARTFC_Indoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3564/American_Rivers_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3562/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3515/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3561/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3560/Coast_to_Coast_Indoor_Performance_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3591/All_Ohio_DIII_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3585/DIII_New_England_Indoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3729/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3563/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "Great Northeast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3584/Great_Northeast_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3559/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3565/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3566/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "Little Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3567/Little_East_Indoor_Performance_List"
  },
  {
    "conf": "MASCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3568/MASCAC_Indoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3572/MIAC_Indoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3569/Michigan_Intercollegiate_Indoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3570/Middle_Atlantic_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3571/The_Midwest_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3575/NACC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3588/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3573/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3574/North_Coast_AC_Indoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3625/Northwest_Conference_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3577/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3576/OAC_Indoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3578/Presidents_AC_Indoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3583/SLIAC_Indoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3579/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3580/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3581/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3582/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3495/2021_2022_NAIA_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3508/American_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3510/Appalachian_AC_Indoor_Performance_List"
  },
  {
    "conf": "Chicagoland Collegiatemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3512/Chicagoland_Collegiate_Indoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3509/Crossroads_League_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3503/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3502/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3505/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3587/Mid_South_Conference_Indoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3507/_North_Star_Indoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3511/River_States_Indoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3504/The_Sun_Conference_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3506/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3496/2021_2022_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3491/2021_2022_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3191/2021_NCAA_Division_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3192/2021_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3193/2021_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3368/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3378/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3414/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3380/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3388/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3364/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3377/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3381/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3367/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3391/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3386/Colonial_CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3369/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3371/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3463/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3382/Mid_Eastern_MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3399/Metro_Atlantic_MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3374/Mid_American_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3372/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3383/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3395/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3452/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3379/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3384/Pac_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3385/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3375/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3370/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3376/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3365/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3366/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3373/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3331/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3387/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3194/2021_NCAA_Division_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3443/DII_Atlantic_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3444/DII_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3445/DII_East_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3446/DII_Midwest_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3447/DII_South_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3448/DII_South_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3449/DII_Southeast_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3450/DII_West_Region_Outdoor_Performance_List"
  },
  {
    "conf": "CACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3456/CACC_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3336/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "ECCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3349/ECC_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3332/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3344/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3345/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3347/Great_American_Outdoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3338/Great_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3341/Gulf_South_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3340/Lone_Star_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3337/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3348/Mountain_East_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3454/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3342/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3393/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3350/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3346/Peach_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3339/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3343/South_Atlantic_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3195/2021_NCAA_Division_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3438/DIII_Great_Lakes_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3439/DIII_Mideast_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3440/DIII_Midwest_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3436/DIII_Atlantic_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3437/DIII_Central_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3441/DIII_South_SE_Region_Outdoor_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3442/DIII_West_Region_Outdoor_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3459/AARTFC_Outdoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3353/American_Rivers_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3432/Atlantic_East_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3358/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3462/Colonial_States_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3431/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3396/Coast_to_Coast_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3451/DIII_New_England_Region_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3360/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3333/HCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3430/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3453/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "Little Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3397/Little_East_Outdoor_Performance_List"
  },
  {
    "conf": "MASCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3457/MASCAC_Outdoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3354/MIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3356/Michigan_Intercollegiate_Outdoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3398/Middle_Atlantic_Conferences_Outdoor_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3392/Midwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3433/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3452/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3461/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NEWMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3460/NEWMAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3455/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3352/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3335/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3351/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3355/Ohio_Athletic_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3361/Presidents_Athletic_Conference_Performance_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3400/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3429/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3435/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3434/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3363/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3458/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3357/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "USA Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3362/USA_South_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3359/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3196/2021_NAIA_Outdoor_Qualifying_List_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3326/American_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3328/Appalachian_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3324/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Chicagoland Collegiatemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3330/Chicagoland_Collegiate_Outdoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3327/Crossroads_League_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3389/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3320/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3319/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3322/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3390/Mid_South_Outdoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3325/North_Star_AA_Outdoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3329/River_States_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3321/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3323/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3334/NJCAA_All_Schools_Outdoor_Performance_List"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3198/2021_NJCAA_DI_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3199/2021_NJCAA_DIII_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3197/2021_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3394/2021_NWAC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3157/2020_2021_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3179/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3214/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3220/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3171/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3213/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3222/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3178/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3183/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3180/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3225/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3201/Mid_American_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3182/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3227/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3221/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3205/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3181/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3212/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3174/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3175/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3190/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3168/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3158/2020_2021_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3218/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3169/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3229/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3316/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3172/G_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3210/Gulf_South_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3209/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3170/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3211/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3173/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3219/South_Atlantic_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3161/2020_2021_NCAA_Division_III_Indoor_Qualifying_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3215/American_Rivers_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3230/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3318/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3206/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3217/MIAC_Indoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3226/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3208/North_Coast_AC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3207/Old_Dominion_AC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3224/Ohio_Athletic_Conference_Indoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3312/SLIAC_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3228/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3313/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3156/2020_2021_NAIA_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3231/American_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3188/Appalachian_AC_Indoor_Performance_List"
  },
  {
    "conf": "Chicagoland Collegiatemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3216/Chicagoland_Collegiate_Indoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3187/Crossroads_League_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3185/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3186/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3184/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3203/North_Star_Indoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3204/River_States_Indoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3189/Sun_Conference_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3223/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3159/2020_2021_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3160/2020_2021_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2909/2020_NCAA_Division_I_Outdoor_Qualifying"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2910/2020_NCAA_Div_I_East_Outdoor_Qualifying"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2911/2020_NCAA_Div_I_West_Outdoor_Qualifying"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3123/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3118/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3121/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3149/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3120/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3124/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3125/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3126/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3127/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3129/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3128/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3130/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3147/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3117/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3132/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3140/Metro_Atlantic_MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3146/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3131/MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3142/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3119/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3134/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3145/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3143/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3135/Pac_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3139/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3133/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3136/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3141/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3116/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3137/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3148/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3144/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3138/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2908/2020_NCAA_Div_II_Outdoor_Qualifying"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3057/DII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3058/DII_Central_Region_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3059/DII_East_Region_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3060/DII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3061/DII_South_Central_Region_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3062/DII_South_Region_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3063/DII_Southeast_Region_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3064/DII_West_Region_Performance_List"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3048/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3037/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3038/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3039/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3040/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3041/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3056/Great_American_Conference_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3053/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3055/Gulf_South_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3046/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3042/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3146/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3052/Mountain_East_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3145/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3043/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3044/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3036/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3049/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3050/Peach_Belt_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3045/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "SIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3047/SIAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3054/South_Atlantic_Conference_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2907/2020_NCAA_Div_III_Outdoor_Qualifying"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3105/DIII_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3106/DIII_Mideast_Region_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3107/DIII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3103/DIII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3104/DIII_Central_Region_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3108/DIII_South_SE_Region_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3109/DIII_West_Region_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3110/AARTFC_Outdoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3079/American_Rivers_Conf_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3112/Atlantic_East_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3077/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3102/Colonial_States_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3073/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3076/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3075/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3098/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3071/DIII_New_England_Region_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3070/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3078/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3074/HCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3080/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3081/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "Little Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3115/Little_East_Outdoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3085/MIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3146/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3082/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3083/Middle_Atlantic_Conferences_Outdoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3084/The_Midwest_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3089/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3145/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3069/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NEWMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3086/NEWMAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3087/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "North Atlantic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3111/North_Atlantic_Conf_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3088/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3090/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3092/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3091/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3093/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3072/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3099/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3100/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3094/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3101/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3095/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3096/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "USA Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3113/USA_South_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3097/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2912/2020_NAIA_Outdoor_Qualifying_List"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3029/American_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3031/Appalachian_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3026/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3030/Crossroads_League_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3023/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3021/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3019/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3024/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3027/Mid_South_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3028/North_Star_AA_Outdoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3032/River_States_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3022/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3025/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3034/2020_US_Comm_ColTrack_Coaches_Assn_Rankings"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2913/2020_NJCAA_DI_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2914/2020_NJCAA_DIII_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2915/2020_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/3035/NWAC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2770/2019_2020_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2825/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2820/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2824/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2823/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2847/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2822/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2826/_Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2827/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2828/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2829/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2830/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2773/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2819/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2832/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2844/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2839/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2848/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2831/MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2841/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2821/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2834/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2775/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2842/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2838/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2833/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2835/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2840/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2818/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2836/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2846/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2843/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2837/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2771/2019_2020_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2762/DII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2763/DII_Central_Region_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2764/DII_East_Region_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2765/DII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2766/DII_South_Central_Region_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2767/DII_South_Region_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2768/DII_Southeast_Region_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2769/DII_West_Region_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2805/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2806/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "ECCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2815/ECC_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2807/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2808/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2809/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2816/G_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2879/Gulf_South_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2814/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2810/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2848/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2878/Mountain_East_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2775/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2811/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2812/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2804/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2813/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2817/South_Atlantic_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2772/2019_2020_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2755/DIII_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2756/DIII_Mideast_Region_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2757/DIII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2753/DIII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2754/DIII_Central_Region_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2758/DIII_South_SE_Region_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2759/DIII_West_Region_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2760/AARTFC_Indoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2783/American_Rivers_Conference_Indoor_Perf_List"
  },
  {
    "conf": "Atlantic Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2803/Atlantic_East_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2781/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2777/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2780/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2779/Capital_Athletic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2761/All_Ohio_DIII_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2752/DIII_New_England_Region_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2774/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2782/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2778/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2784/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2785/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "Little Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2881/Little_East_Indoor_Performance_List"
  },
  {
    "conf": "MASCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2905/MASCAC_Indoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2789/MIAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2848/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2786/Michigan_Intercollegiate_AA_Indoor_Perf_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2787/Middle_Atlantic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2788/The_Midwest_Conference_Indoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2794/NACC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2775/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2790/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2793/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2796/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2795/OAC_Indoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2797/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2904/SLIAC_Indoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2798/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2799/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2800/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2801/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2849/2019_2020_NAIA_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2858/American_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2860/Appalachian_AC_Indoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2855/Cascade_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Chicagoland Collegiatemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2877/Chicagoland_Collegiate_Indoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2859/Crossroads_League_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2852/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2850/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2853/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2856/Mid_South_Conference_Indoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2857/North_Star_AA_Indoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2861/River_States_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2854/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2863/2019_2020_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2862/2019_2020_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2568/2019_NCAA_Division_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2569/2019_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2570/2019_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2654/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2649/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2653/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2652/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2680/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2651/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2655/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2656/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2657/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2658/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2660/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2659/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2661/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2678/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2648/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2663/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2671/Metro_Atlantic_MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2677/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2662/MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2673/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2650/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2665/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2676/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2674/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2666/Pac_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2670/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2664/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2667/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2672/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2647/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2668/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2679/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2675/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2669/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2571/2019_NCAA_Div_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2638/DII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2639/DII_Central_Region_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2640/DII_East_Region_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2641/DII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2642/DII_South_Central_Region_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2643/DII_South_Region_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2644/DII_Southeast_Region_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2645/DII_West_Region_Performance_List"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2630/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2619/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2620/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2621/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2622/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2623/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2637/Great_American_Conference_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2634/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2636/Gulf_South_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2628/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2624/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2677/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2633/Mountain_East_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2676/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2625/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2626/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2618/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2631/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2632/Peach_Belt_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2627/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "SIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2629/SIAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2635/South_Atlantic_Conference_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2572/2019_NCAA_Div_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2611/DIII_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2612/DIII_Mideast_Region_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2613/DIII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2609/DIII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2610/DIII_Central_Region_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2614/DIII_South_SE_Region_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2615/DIII_West_Region_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2616/AARTFC_Outdoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2584/American_Rivers_Conf_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2681/Atlantic_East_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2582/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2607/Colonial_States_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2578/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2581/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2580/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2603/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2576/DIII_New_England_Region_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2575/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2583/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2579/HCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2585/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2586/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2590/MIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2677/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2587/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2588/Middle_Atlantic_Conferences_Outdoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2589/The_Midwest_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2594/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2676/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2574/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NEWMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2591/NEWMAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2592/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "North Atlantic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2617/North_Atlantic_Conf_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2593/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2595/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2597/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2596/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2598/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2577/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2604/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2605/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2599/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2606/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2600/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2601/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "USA Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2729/USA_South_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2602/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2551/2019_NAIA_Outdoor_Qualifying_List_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2692/American_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2694/Appalachian_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2689/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2693/Crossroads_League_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2686/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2684/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2682/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2687/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2690/Mid_South_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2691/North_Star_AA_Outdoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2695/River_States_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2685/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2688/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2700/2019_US_Comm_ColTrack_Coaches_Assn_Rankings"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2698/2019_NJCAA_DI_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2699/2019_NJCAA_DIII_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2696/2019_NCCAA_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2701/NWAC_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2697/USCAA_Outdoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2324/2018_2019_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2410/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2415/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2411/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2412/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2388/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2413/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2409/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2408/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2407/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2406/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2405/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2327/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2416/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2403/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2391/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2396/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2331/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2404/MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2394/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2414/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2401/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2329/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2393/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2397/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2402/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2400/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2395/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2417/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2399/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2389/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2392/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2398/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2325/2018_2019_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2442/DII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2443/DII_Central_Region_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2444/DII_East_Region_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2445/DII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2446/DII_South_Central_Region_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2447/DII_South_Region_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2448/DII_Southeast_Region_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2449/DII_West_Region_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2378/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2377/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "ECCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2368/ECC_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2376/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2375/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2374/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2367/G_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2369/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2373/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2331/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2329/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2372/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2371/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2379/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2370/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2366/South_Atlantic_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2326/2018_2019_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2453/DIII_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2454/DIII_Mideast_Region_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2455/DIII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2451/DIII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2452/DIII_Central_Region_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2456/DIII_South_SE_Region_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2457/DIII_West_Region_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2459/AARTFC_Indoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2351/American_Rivers_Conference_Indoor_Perf_List"
  },
  {
    "conf": "Atlantic Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2461/Atlantic_East_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2353/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2357/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2354/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2355/Capital_Athletic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2460/All_Ohio_DIII_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2450/DIII_New_England_Region_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2328/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2352/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2356/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2350/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2349/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2345/MIAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2331/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2348/Michigan_Intercollegiate_AA_Indoor_Perf_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2347/Middle_Atlantic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2346/The_Midwest_Conference_Indoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2342/NACC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2329/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2344/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2433/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2340/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2341/OAC_Indoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2339/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2338/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2337/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2336/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2335/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2418/2018_2019_NAIA_Indoor_Qualifying_List_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2420/American_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Appalachian ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2429/Appalachian_AC_Indoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2423/Cascade_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2419/Crossroads_League_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2426/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2428/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2425/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2422/Mid_South_Conference_Indoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2421/North_Star_AA_Indoor_Performance_List"
  },
  {
    "conf": "River States Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2440/River_States_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2424/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2431/2018_2019_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2432/2018_2019_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2279/2018_NCAA_Division_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2280/2018_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2281/2018_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2250/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2245/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2249/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2248/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2273/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2247/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2251/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2252/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2253/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2254/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2256/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2255/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2257/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2274/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2244/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2259/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2267/Metro_Atlantic_MACC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2276/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2258/MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2269/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2246/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2261/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2275/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2270/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2262/Pac_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2266/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2260/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2263/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2268/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2243/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2264/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2272/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2271/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2265/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2282/2018_NCAA_Div_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2304/DII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2305/DII_Central_Region_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2306/DII_East_Region_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2307/DII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2308/DII_South_Central_Region_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2309/DII_South_Region_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2310/DII_Southeast_Region_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2311/DII_West_Region_Performance_List"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2296/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2285/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2286/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2287/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2288/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2289/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2303/Great_American_Conference_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2300/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2302/Gulf_South_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2294/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2290/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2276/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2299/Mountain_East_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2275/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2291/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2292/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2284/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2297/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2298/Peach_Belt_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2293/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "SIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2295/SIAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2301/South_Atlantic_Conference_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2283/2018_NCAA_Div_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2238/DIII_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2239/DIII_Mideast_Region_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2240/DIII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2236/DIII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2237/DIII_Central_Region_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2241/DIII_South_SE_Region_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2242/DIII_West_Region_Performance_List"
  },
  {
    "conf": "AARTFCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2312/AARTFC_Outdoor_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2211/IIAC_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2209/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2234/Colonial_States_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2205/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2208/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2207/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2230/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2203/DIII_New_England_Region_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2277/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2210/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2206/HCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2212/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2213/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2217/MIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2276/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2214/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2215/Middle_Atlantic_Conferences_Outdoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2216/The_Midwest_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2221/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2275/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2202/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NEWMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2218/NEWMAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2219/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "North Atlantic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2319/North_Atlantic_Conf_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2220/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2222/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2224/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2223/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2225/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2204/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2231/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2232/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2226/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2233/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2227/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2228/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2229/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2171/2018_NAIA_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2194/American_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2191/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2195/Crossroads_League_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2197/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2188/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2186/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2189/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2192/Mid_South_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2193/North_Star_AA_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2196/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2190/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2201/2018_US_Comm_ColTrack_Coaches_Assn_Rankings"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2199/2018_NJCAA_DI_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2200/2018_NJCAA_DIII_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2198/2018_NCCAA_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2313/NWAC_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2314/USCAA_Outdoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2124/2017_2018_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2050/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2045/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2049/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2048/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2072/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2047/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2051/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2052/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2053/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2054/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2055/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2123/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2044/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2057/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2069/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2064/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2042/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2056/MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2066/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2046/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2059/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2121/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2067/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2063/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2058/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2060/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2065/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2043/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2061/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2071/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2068/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2062/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2125/2017_2018_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2075/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2076/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2077/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2078/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2085/G_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2083/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2079/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2081/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2082/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2148/South_Atlantic_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2126/2017_2018_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2093/IIAC_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2091/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2092/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2088/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2099/MIAC_Indoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2096/Michigan_Intercollegiate_AA_Indoor_Perf_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2101/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2104/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2103/OAC_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2108/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2109/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2129/2017_2018_NAIA_Indoor_Qualifying_List_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2138/American_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Crossroads Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2185/Crossroads_League_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2132/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2130/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2133/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2137/North_Star_AA_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2134/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2128/2017_2018_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2127/2017_2018_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1912/2017_NCAA_Div_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1925/2017_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1926/2017_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2030/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1998/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2002/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2001/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2025/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2000/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2003/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2004/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2005/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2006/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2008/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2007/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2009/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1922/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1997/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2011/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2019/Metro_Atlantic_MACC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1924/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2010/MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2021/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1999/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2013/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1923/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2022/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2014/Pac_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2018/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2012/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2015/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2020/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1996/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2016/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2024/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2023/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2017/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1913/2017_NCAA_Div_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DII Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2033/DII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DII Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2034/DII_Central_Region_Performance_List"
  },
  {
    "conf": "DII East Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2035/DII_East_Region_Performance_List"
  },
  {
    "conf": "DII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2036/DII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DII South Central Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2037/DII_South_Central_Region_Performance_List"
  },
  {
    "conf": "DII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2038/DII_South_Region_Performance_List"
  },
  {
    "conf": "DII Southeast Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2039/DII_Southeast_Region_Performance_List"
  },
  {
    "conf": "DII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2040/DII_West_Region_Performance_List"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1939/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1928/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1929/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1930/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1931/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1932/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1944/Great_American_Conference_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1942/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Gulf Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2029/Gulf_South_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1937/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1933/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1924/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1945/Mountain_East_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1923/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1934/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1935/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1927/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1940/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1941/Peach_Belt_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1936/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "SIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1938/SIAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1943/South_Atlantic_Conference_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1914/2017_NCAA_Div_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1981/DIII_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1982/DIII_Mideast_Region_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1983/DIII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1979/DIII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1980/DIII_Central_Region_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1984/DIII_South_SE_Region_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1985/DIII_West_Region_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1955/IIAC_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1953/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2031/Colonial_States_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1949/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1952/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1951/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1973/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1947/DIII_New_England_Region_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1921/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1954/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1950/HCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1956/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1957/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1978/MIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1924/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1958/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1959/Middle_Atlantic_Conferences_Outdoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1960/The_Midwest_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1964/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1923/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1946/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NEWMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1961/NEWMAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1962/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2027/NYSCTC_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1963/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1965/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1967/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1966/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1968/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1948/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1974/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1975/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1969/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1976/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1970/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1971/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1972/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1916/2017_NAIA_Outdoor_Qualifying_List_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2026/American_Midwest_Outdoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1993/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1990/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1988/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1986/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1991/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2032/Mid_South_Outdoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1995/North_Star_AA_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1989/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1992/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2041/2017_US_Comm_ColTrack_Coaches_Assn_Rankings"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1918/2017_NJCAA_Division_I_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1919/2017_NJCAA_Division_III_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1917/2017_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/2028/NWAC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1797/2016_2017_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1807/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1802/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1806/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1805/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1829/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1804/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1808/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1809/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1810/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1811/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1812/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1796/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1801/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1814/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1826/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1821/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1883/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1813/MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1823/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1803/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1816/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1794/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1824/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1820/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1815/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1817/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1822/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1800/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1818/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1828/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1825/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1819/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1798/2016_2017_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1831/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1832/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "ECCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1841/ECC_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1833/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1834/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1835/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1842/G_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1840/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1836/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1883/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1794/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1837/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1838/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1830/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1839/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1799/2016_2017_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "DIII Great Lakes Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1902/DIII_Great_Lakes_Region_Performance_List"
  },
  {
    "conf": "DIII Mid-Atlantic Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1903/DIII_Mideast_Region_Performance_List"
  },
  {
    "conf": "DIII Midwest Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1904/DIII_Midwest_Region_Performance_List"
  },
  {
    "conf": "DIII Niagara Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1900/DIII_Atlantic_Region_Performance_List"
  },
  {
    "conf": "DIII North Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1901/DIII_Central_Region_Performance_List"
  },
  {
    "conf": "DIII South Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1905/DIII_South_SE_Region_Performance_List"
  },
  {
    "conf": "DIII West Regionmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1906/DIII_West_Region_Performance_List"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1849/IIAC_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1847/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1844/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1846/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1875/Capital_Athletic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1865/All_Ohio_DIII_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1843/DIII_New_England_Region_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1795/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1848/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1845/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1850/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1851/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1881/MIAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1883/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1852/Michigan_Intercollegiate_AA_Indoor_Perf_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1853/Middle_Atlantic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1854/The_Midwest_Conference_Indoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1857/NACC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1794/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1855/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1864/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1856/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1858/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1884/OAC_Indoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1859/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1860/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1861/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1862/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1863/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1868/2016_2017_NAIA_Indoor_Qualifying_List_FINAL"
  },
  {
    "conf": "American Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1882/American_Midwest_Indoor_Performance_List"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1874/Cascade_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1871/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1869/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1872/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "Mid-South Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1920/Mid_South_Conference_Indoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1910/North_Star_AA_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1873/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1867/2016_2017_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1866/2016_2017_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1688/2016_NCAA_Division_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1687/2016_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1686/2016_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1696/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1691/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1695/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1694/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1719/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1693/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1697/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1698/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1699/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1700/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1702/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1701/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1703/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1682/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1690/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1705/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1713/Metro_Atlantic_MACC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1681/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1704/MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1715/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1692/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1707/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1680/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1716/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1708/PAC_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1712/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1706/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1709/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1714/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1689/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1710/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1718/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1717/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1711/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1685/2016_NCAA_Division_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1731/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1721/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1722/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1723/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1724/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1725/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1790/Great_American_Conference_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1735/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1730/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1726/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1681/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1680/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1727/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1728/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1720/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1733/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1734/Peach_Belt_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1729/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "SIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1791/SIAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1736/South_Atlantic_Conference_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1684/2016_NCAA_Division_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1745/IIAC_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1743/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1782/Colonial_States_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1740/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1742/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1741/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1764/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1738/DIII_New_England_Outdoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1679/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1744/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1785/HCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1746/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1747/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1681/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1748/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1749/Middle_Atlantic_Conferences_Outdoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1750/The_Midwest_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1754/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1680/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1737/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NEWMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1783/NEWMAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1752/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1763/NYSCTC_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1753/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1755/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1757/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1756/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1758/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1739/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1765/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1766/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1759/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1767/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1760/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1761/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1762/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1662/2016_NAIA_Outdoor_Qualifying_List_FINAL"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1775/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1772/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1770/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1768/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1773/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1777/North_Star_AA_Outdoor_Performance_List"
  },
  {
    "conf": "Southern States ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1776/Southern_States_AC_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1771/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1774/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1792/2016_US_Comm_ColTrack_Coaches_Assn_Rankings"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1779/2016_NJCAA_Division_I_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1780/2016_NJCAA_Division_III_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1778/2016_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1789/NWAC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1569/2015_2016_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1595/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1590/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1594/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1593/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1616/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1592/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1596/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1597/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1598/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1599/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1600/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1572/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1589/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1659/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1613/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1608/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1586/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1601/MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1610/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1591/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1603/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1584/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1611/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1607/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1602/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1604/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1609/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1588/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1605/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1615/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1612/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1606/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1570/2015_2016_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1618/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1619/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "ECCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1781/ECC_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1620/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1621/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1622/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1628/G_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1627/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1623/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1586/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1584/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1624/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1625/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1617/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1626/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1571/2015_2016_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1636/IIAC_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1634/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1630/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1633/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1632/Capital_Athletic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1653/All_Ohio_DIII_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1629/DIII_New_England_Indoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1585/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1635/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1631/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1637/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1638/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1586/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1784/Michigan_Intercollegiate_AA_Indoor_Perf_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1639/Middle_Atlantic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1640/The_Midwest_Conference_Indoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1643/NACC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1584/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1641/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1651/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1642/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1645/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1644/OAC_Indoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1646/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1647/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1648/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1649/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1650/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1576/2015_2016_NAIA_Indoor_Qualifying_List_FINAL"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1583/Cascade_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1580/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1577/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1581/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "North Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1658/North_Star_AA_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1582/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1575/2015_2016_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1654/2015_2016_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1439/2015_NCAA_Division_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1440/2015_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1441/2015_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1527/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1523/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1526/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1525/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1550/Big_East_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1524/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1528/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1529/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1530/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1531/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1533/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1532/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1534/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1520/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1522/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1536/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1544/Metro_Atlantic_MACC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1473/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1535/MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1546/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1551/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1538/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1472/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1547/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1539/PAC_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1543/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1537/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1540/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1545/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1521/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1541/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1549/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1548/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1542/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1442/2015_NCAA_Division_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1466/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1456/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1457/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1458/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1459/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1460/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1470/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1465/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1461/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1473/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1472/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1462/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1561/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1455/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1468/PacWest_Outdoor_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1469/Peach_Belt_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1464/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1471/South_Atlantic_Conference_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1443/2015_NCAA_Division_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1497/IIAC_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1495/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1491/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1494/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1493/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1512/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1489/DIII_New_England_Outdoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1519/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1496/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1492/Heartland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1498/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1516/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "MIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1562/MIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1473/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1499/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1500/Middle_Atlantic_Conferences_Outdoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1560/The_Midwest_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1503/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1472/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1487/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1501/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1511/NYSCTC_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1502/North_Coast_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1504/Northwest_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1506/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1505/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1507/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1490/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1513/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1514/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1508/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1515/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1509/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1510/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1517/WIAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1438/2015_NAIA_Outdoor_Qualifying_List_FINAL"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1454/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1451/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1449/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1447/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1452/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern States ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1553/Southern_States_AC_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1450/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1453/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1557/2015_US_Comm_ColTrack_Coaches_Assn_Rankings"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1445/2015_NJCAA_Division_I_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1446/2015_NJCAA_Division_III_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1444/2015_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1558/NWAACC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1345/2014_2015_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1403/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1398/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1402/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1401/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1421/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1400/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1404/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1405/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1406/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1407/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1408/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1388/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1397/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1424/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1422/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1414/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1428/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1423/MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1416/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1399/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1410/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1389/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1417/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1413/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1409/SEC_Indoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1437/SWAC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1415/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1396/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1411/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1420/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1418/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1412/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1347/2014_2015_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1376/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1377/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1378/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1379/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1380/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1386/G_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1385/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1381/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1428/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1389/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1382/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1383/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1375/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1384/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1353/2014_2015_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1360/IIAC_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1358/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1355/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1357/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1356/Capital_Athletic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1363/All_Ohio_DIII_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1425/DIII_New_England_Indoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1387/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1359/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1430/HCAC_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1354/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1361/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1428/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1373/Middle_Atlantic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "Midwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1431/The_Midwest_Conference_Indoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1370/NACC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1389/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1372/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1362/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1371/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1368/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1369/OAC_Indoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1367/Presidents_Athletics_Conference_PAC_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1366/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1365/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1364/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "WIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1427/WIAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1349/2014_2015_NAIA_Indoor_Qualifying_List_FINAL"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1390/Cascade_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1391/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1392/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1393/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1395/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1352/2014_2015_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1348/2014_2015_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1228/2014_NCAA_Division_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1229/2014_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1230/2014_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1285/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1279/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1284/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1283/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1281/BIG_EAST_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1282/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1286/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1287/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1288/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1289/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1290/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1306/Conference_USA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1291/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1305/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1278/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1309/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1298/Metro_Atlantic_MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1304/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1308/MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1300/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1280/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1293/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1303/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1301/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1294/Pac_12_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1297/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1292/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "SWACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1344/SWAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1299/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1277/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1295/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1307/The_American_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1302/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1296/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1231/2014_NCAA_Division_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1271/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1262/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1263/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1264/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1265/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1266/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1275/G_MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1270/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1267/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1304/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1303/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1268/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1276/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1261/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1273/PacWest_Track__Field_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1274/Peach_Belt_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1269/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "South Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1342/South_Atlantic_Conference_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1232/2014_NCAA_Division_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1320/IIAC_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1318/CCIW_Outdoor_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1314/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1317/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1316/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1337/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1312/DIII_New_England_Outdoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1311/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1319/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1315/Heartland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1321/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1322/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1304/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1323/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1325/Middle_Atlantic_Conferences_Outdoor_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1328/NACC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1303/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1310/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1326/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1335/NYSCTC_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1327/NCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1329/Northwest_Conference_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1331/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1330/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1324/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1313/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1338/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1339/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1332/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1340/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1333/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1334/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1227/2014_NAIA_Outdoor_Qualifying_List_FINAL"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1260/Cascade_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1257/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1255/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1253/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1258/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1256/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1259/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1252/2014_US_Comm_ColTrack_Coaches_Assn_Rankings"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1234/2014_NJCAA_Division_I_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1235/2014_NJCAA_Division_III_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1233/2014_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1341/NWAACC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1139/2013_2014_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1162/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1156/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1161/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1160/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "BIG EASTmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1222/BIG_EAST_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1159/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1158/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1163/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1164/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Conference USAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1154/Conference_USA_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1165/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1210/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1150/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1168/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1178/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1173/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1215/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1167/MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1175/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1157/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1171/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1213/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1176/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1172/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1169/SEC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1174/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1152/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1153/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1166/The_American_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1177/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1170/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1140/2013_2014_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1155/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1186/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1181/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1182/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1183/GNAC_Indoor_Conference_List"
  },
  {
    "conf": "Great Midwestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1209/G_MAC_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1188/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1189/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1215/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1213/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1184/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1190/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1149/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1185/RMAC_Indoor_Conference_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1141/2013_2014_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1196/IIAC_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1202/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1221/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1192/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1191/Capital_Athletic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1195/All_Ohio_DIII_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1212/DIII_New_England_Indoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1214/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1194/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1151/Heartland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1197/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1198/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1215/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1199/Middle_Atlantic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1208/NACC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1213/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1200/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1203/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1201/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1205/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1204/OAC_Indoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1216/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1206/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1207/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1180/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1142/2013_2014_NAIA_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "Cascade Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1223/Cascade_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1217/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1226/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1219/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1218/WHAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1143/2013_2014_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1144/2013_2014_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1029/2013_NCAA_Division_I_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1030/2013_NCAA_Div_I_East_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1031/2013_NCAA_Div_I_West_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1080/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1074/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1079/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1078/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1077/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1081/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1082/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1083/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1084/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1085/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1086/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1104/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1051/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1090/MEAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1096/Metro_Atlantic_MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1102/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1091/MAC_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1098/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1075/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1088/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1101/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1099/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1089/Pac_12_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1095/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1087/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1097/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1092/Southland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1093/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1100/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1094/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1032/2013_NCAA_Division_II_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1053/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1072/CIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1063/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1064/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1071/GLVC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1065/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1070/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1066/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1102/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1101/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1067/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1068/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1062/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "PacWestmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1138/PacWest_Track__Field_Performance_List"
  },
  {
    "conf": "Peach Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1073/Peach_Belt_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1069/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1033/2013_NCAA_Division_III_Outdoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1133/IIAC_Outdoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1112/CCIW_Outdoor_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1107/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1111/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1110/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1129/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1108/DIII_New_England_Outdoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1106/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1113/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1109/Heartland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1134/Landmark_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1114/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1102/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1115/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1116/Middle_Atlantic_Conferences_Outdoor_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1118/Northern_AC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1101/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1105/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1132/NJAC_Outdoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1126/NYSCTC_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1117/NCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1119/Northwest_Conference_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1121/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1120/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1122/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1052/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1130/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1131/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1123/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Athletic Associationmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1135/SAA_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1124/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1125/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1026/2013_NAIA_Outdoor_Qualifying_List_FINAL"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1058/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1057/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1055/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1059/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1054/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1060/WHAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1137/2013_US_Comm_ColTrack_Coaches_Assn_Rankings"
  },
  {
    "conf": "NJCAA Div. Imwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1027/2013_NJCAA_Division_I_Outdoor_Qualifying_List"
  },
  {
    "conf": "NJCAA Div. IIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1028/2013_NJCAA_Division_III_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1025/2013_NCCAA_Outdoor_Qualifying_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1136/NWAACC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/942/2012_2013_NCAA_Div_I_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/972/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/968/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/971/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/970/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/969/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/988/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/973/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/974/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/975/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/950/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/967/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MEACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/963/MEAC_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/986/MPSF_Indoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/981/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1020/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Mid-Americanmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/965/MAC_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/982/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/958/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/977/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/949/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/984/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/980/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/976/SEC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/983/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Southland Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/966/Southland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/978/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/985/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/979/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/943/2012_2013_NCAA_Div_II_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "CIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1021/CIAA_Indoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1022/Conference_Carolinas_Indoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/959/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GLVCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/964/GLVC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/953/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1017/Lone_Star_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1014/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1020/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/949/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1013/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1024/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/954/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/962/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/944/2012_2013_NCAA_Div_III_Indoor_Qualifying_FINAL"
  },
  {
    "conf": "American Rivers Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1004/IIAC_Indoor_Performance_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/992/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1015/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1007/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1005/Capital_Athletic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1008/All_Ohio_DIII_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/951/DIII_New_England_Indoor_Performance_List_FINAL"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/952/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/993/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/990/Heartland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Landmark Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1006/Landmark_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/994/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1020/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/995/Middle_Atlantic_Conferences_Indoor_Perf_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/998/Northern_AC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/949/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NJACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1023/NJAC_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/957/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/997/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/996/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/999/OAC_Indoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/956/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1000/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1001/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/945/2012_2013_NAIA_Indoor_Qualifying_List_FINAL"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1010/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1009/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1011/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/1012/Wolverine_Hoosier_AC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/947/2012_2013_NJCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/946/2012_2013_NCCAA_Indoor_Qualifying_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/840/2012_NCAA_Div_I_Outdoor_Qualifiers_Final"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/843/2012_NCAA_Div_I_East_Qualifiers_Final"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/844/2012_NCAA_Div_I_West_Qualifiers_Final"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/918/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/912/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/917/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/916/Atlantic_10_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/915/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/919/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/920/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/925/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/882/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/926/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/929/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/921/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/911/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/935/Metro_Atlantic_MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/924/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/937/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/913/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/931/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/922/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/938/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/923/Pac_12_Outdoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/934/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/930/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/936/Southern_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/932/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/928/The_Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/933/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/841/2012_NCAA_Div_II_Outdoor_Qualifier_List_Final"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/873/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/871/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/865/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/866/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/872/Lone_Star_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/867/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/924/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/922/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/868/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/869/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/864/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/870/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/842/2012_NCAA_Div_III_Outdoor_Qualifier_List"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/888/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/884/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/887/Centennial_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/886/Capital_Athletic_Conference_Outdoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/905/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/904/DIII_New_England_Outdoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/903/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/889/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/885/Heartland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/890/Liberty_League_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/924/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/910/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/891/Middle_Atlantic_Conferences_Outdoor_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/893/Northern_AC_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/922/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/902/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/899/NYSCTC_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/892/NCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/906/Northwest_Conference_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/895/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/894/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/909/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/883/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/907/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/908/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/896/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/897/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/898/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/845/2012_NAIA_Outdoor_Qualifier_List_FINAL_CLOSED"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/881/Golden_State_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/877/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/875/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/879/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/880/Sun_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/878/Wolverine_Hoosier_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/941/NWAACC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/769/2011_2012_NCAA_Div_I_Indoor_Qualifiers_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/779/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/782/Atlantic_Sun_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/780/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Atlantic 10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/834/Atlantic_10_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/781/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/783/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/784/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/785/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/786/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/830/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/787/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/788/Mountain_Pacific_Sports_Federation_Indoor_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/793/Metro_Atlantic_MAAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/835/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/790/Missouri_Valley_MVC_Indoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/791/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/792/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/829/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/794/Ohio_Valley_OVC_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/796/Patriot_League_Indoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/797/SEC_Indoor_Performance_List"
  },
  {
    "conf": "Southern Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/795/Southern_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/798/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/778/The_Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/800/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/770/2011_12_NCAA_Div_II_Indoor_Qualifiers_FINAL"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/805/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/806/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/807/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/835/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/829/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/831/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/808/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/804/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/809/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/771/2011_2012_NCAA_Div_III_Indoor_Qualifiers_FINAL"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/813/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/811/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "Centennial Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/810/Centennial_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Coast-to-Coastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/839/Capital_Athletic_Conference_Indoor_Perf_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/827/DIII_All_Ohio_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/828/DIII_New_England_Indoor_Performance_List_Final"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/826/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/814/Empire_8_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/812/Heartland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Liberty Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/846/Liberty_League_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/835/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/818/Middle_Atlantic_Conferences_Indoor_List"
  },
  {
    "conf": "NACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/824/Northern_AC_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/829/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/815/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/821/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/816/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/822/OAC_Indoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/817/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/819/UAA_Indoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/823/UMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/772/2011_2012_NAIA_Indoor_Qualifier_List_Final"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/801/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/832/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/802/KCAC_Indoor_Performance_List"
  },
  {
    "conf": "WHACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/859/Wolverine_Hoosier_AC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/838/2011_2012_NJCAA_Indoor_Performance_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/673/2011_NCAA_Division_I_Outdoor_POP_List_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/693/2011_NCAA_Division_I_East_POP_List_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/694/2011_NCAA_Division_I_West_POP_List_FINAL"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/751/ACC_Outdoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/730/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/733/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/762/Big_12_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/734/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/735/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/736/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/737/Big_West_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/738/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/739/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/755/IC4A_ECAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/729/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/746/MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/750/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/747/Missouri_Valley_MVC_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/731/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/740/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/749/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/748/Ohio_Valley_OVC_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/741/Pac_10_Conference_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/745/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/752/SEC_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/743/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/754/Summit_League_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/744/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/674/2011_NCAA_Division_II_Outdoor_POP_List_FINAL"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/698/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/700/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/707/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/708/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/699/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/711/MIAA_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/750/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/749/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/709/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/710/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/706/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/712/RMAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/675/2011_NCAA_Division_III_Outdoor_POP_List_FINAL"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/726/CCIW_Outdoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/717/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/728/DIII_All_Ohio_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/716/DIII_New_England_Outdoor_Performance_List_FINAL"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/715/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/719/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/718/Heartland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/750/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Michigan Intercollegiate AAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/767/Michigan_Intercollegiate_MIAA_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/727/Middle_Atlantic_Conferences_Outdoor_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/749/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/714/NESCAC_Outdoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/721/NYSCTC_Outdoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/725/NCAC_Outdoor_Performance_List"
  },
  {
    "conf": "Northwest Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/697/Northwest_Conference_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/742/ODAC_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/723/OAC_Outdoor_Performance_List"
  },
  {
    "conf": "Presidents ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/704/Presidents_Athletic_Conference_PAC_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/705/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SCIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/696/SCIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/765/SLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/720/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/724/UAA_Outdoor_Performance_List"
  },
  {
    "conf": "UMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/763/UMAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/676/2011_NAIA_Outdoor_POP_List_FINAL_CLOSED"
  },
  {
    "conf": "Golden State ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/768/Golden_State_AC_Performance_List"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/758/Great_Plains_AC_Outdoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/757/Heart_of_America_AC_Outdoor_Performance_List"
  },
  {
    "conf": "KCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/766/KCAC_Outdoor_Performance_List"
  },
  {
    "conf": "The Sun Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/764/The_Sun_Conference_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/759/2011_NWAACC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/607/2010_2011_NCAA_Div_I_Indoor_POP_List_Final"
  },
  {
    "conf": "ACCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/664/ACC_Indoor_Performance_List"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/619/Atlantic_Sun_Conference_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/622/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Big 12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/638/Big_12_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/623/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/624/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/625/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/626/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "IC4A/ECACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/692/IC4A_ECAC_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/618/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/635/Mountain_Pacific_Sports_Federation_Indoor_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/631/Metro_Atlantic_Athletic_Conference_MAAC_Indoor"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/643/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/632/Missouri_Valley_Conference_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/620/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/627/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/691/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/633/Ohio_Valley_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/630/Patriot_League_Performance_List"
  },
  {
    "conf": "SECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/636/SEC_Indoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/628/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "The Summit Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/639/Summit_League_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/629/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/608/2010_2011_NCAA_Div_II_Indoor_POP_List_Final"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/642/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/644/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "MIAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/666/MIAA_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/643/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/691/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/645/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/646/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/641/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "RMACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/647/RMAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/609/2010_2011_NCAA_Div_III_Indoor_POP_List_Final"
  },
  {
    "conf": "CCIWmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/672/CCIW_Indoor_Performance_List"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/651/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "DIII All-Ohiomwmenwomen",
    "link": "https://tf.tfrrs.org/lists/668/DIII_All_Ohio_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/690/DIII_New_England_Indoor_Performance_List_FINAL"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/649/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/653/Empire_Eight_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/652/Heartland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/643/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Middle Atlantic Conferencesmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/657/Middle_Atlantic_Conferences_Indoor_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/691/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/654/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "North Coast ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/658/NCAC_Indoor_Performance_List"
  },
  {
    "conf": "ODACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/656/ODAC_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Athletic Conferencemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/659/OAC_Indoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/655/SUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "UAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/689/UAA_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/610/2010_2011_NAIA_Indoor_POP_List_FINAL_CLOSED"
  },
  {
    "conf": "Great Plains ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/665/Great_Plains_AC_Indoor_Performance_List"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/661/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/671/2010_2011_NJCAA_Indoor_Performance_List"
  },
  {
    "conf": "Div. I Combined Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/528/2010_NCAA_Division_I_Outdoor_POP_List_FINAL"
  },
  {
    "conf": "Div. I East Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/537/2010_NCAA_Division_I_East_POP_List_FINAL"
  },
  {
    "conf": "Div. I West Qualifying List mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/538/2010_NCAA_Division_I_West_POP_List_FINAL"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/565/Atlantic_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/567/America_East_Outdoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/568/Big_Sky_Outdoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/569/Big_South_Outdoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/570/Big_Ten_Outdoor_Performance_List"
  },
  {
    "conf": "Big Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/540/Big_West_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "CAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/581/CAA_Outdoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/571/Horizon_League_Outdoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/564/Ivy_League_Outdoor_Performance_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/576/MAAC_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/580/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/577/Missouri_Valley_Outdoor_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/566/Mountain_West_Outdoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/572/Northeast_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/555/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/578/Ohio_Valley_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Pac-12mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/579/Pac_10_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/575/Patriot_League_Outdoor_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/573/Sun_Belt_Outdoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/574/WAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/529/2010_NCAA_Division_II_Outdoor_POP_List_Final"
  },
  {
    "conf": "CCAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/539/CCAA_Outdoor_Performance_List"
  },
  {
    "conf": "Conference Carolinasmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/604/Conference_Carolinas_Outdoor_Performance_List"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/550/GLIAC_Outdoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/549/GNAC_Outdoor_Performance_List"
  },
  {
    "conf": "Lone Starmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/553/Lone_Star_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/580/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/555/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/552/Northeast_10_Outdoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/551/Northern_Sun_Outdoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/548/PSAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/530/2010_NCAA_Division_III_Outdoor_Track__Field"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/558/CUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/557/DIII_New_England_Outdoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/556/ECAC_DIII_Outdoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/563/Empire_8_Outdoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/559/Heartland_Conference_Outdoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/580/Mets_Outdoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/555/NEICAAA_Outdoor_Performance_List"
  },
  {
    "conf": "NESCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/560/NESCAC_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/561/NYSCTC_Outdoor_Performance_List"
  },
  {
    "conf": "SCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/562/SCAC_Outdoor_Performance_List"
  },
  {
    "conf": "SUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/603/SUNYAC_Outdoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/541/2010_NAIA_Outdoor_Track_POP_List_Final_Closed"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/543/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "Outdoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/582/2010_NWAACC_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/502/2009_2010_NCAA_Div_I_Indoor_POP_List_FINAL"
  },
  {
    "conf": "ASUNmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/506/Atlantic_Sun_Conference_Indoor_Performance_List"
  },
  {
    "conf": "America Eastmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/479/America_East_Indoor_Performance_List"
  },
  {
    "conf": "Big Skymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/481/Big_Sky_Indoor_Performance_List"
  },
  {
    "conf": "Big Southmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/482/Big_South_Indoor_Performance_List"
  },
  {
    "conf": "Big Tenmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/483/Big_Ten_Indoor_Performance_List"
  },
  {
    "conf": "Horizon Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/484/Horizon_League_Indoor_Performance_List"
  },
  {
    "conf": "Ivy Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/485/Ivy_League_Indoor_Performance_List"
  },
  {
    "conf": "MPSFmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/488/Mountain_Pacific_Sports_Federation_Indoor_List"
  },
  {
    "conf": "Metro Atlanticmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/486/Metro_Atlantic_Athletic_Conference_MAAC_Indoor"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/513/Mets_Indoor_Performance_List"
  },
  {
    "conf": "Missouri Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/487/Missouri_Valley_Conference_Performance_List"
  },
  {
    "conf": "Mountain Westmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/489/Mountain_West_Indoor_Performance_List"
  },
  {
    "conf": "NECmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/492/Northeast_Conference_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/491/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Ohio Valleymwmenwomen",
    "link": "https://tf.tfrrs.org/lists/490/Ohio_Valley_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Patriot Leaguemwmenwomen",
    "link": "https://tf.tfrrs.org/lists/493/Patriot_League_Performance_List"
  },
  {
    "conf": "Sun Beltmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/494/Sun_Belt_Indoor_Performance_List"
  },
  {
    "conf": "WACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/495/WAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/503/2009_2010_NCAA_Div_II_Indoor_POP_List_Final"
  },
  {
    "conf": "GLIACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/509/GLIAC_Indoor_Performance_List"
  },
  {
    "conf": "GNACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/515/GNAC_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/513/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/491/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "Northeast-10mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/508/Northeast_10_Indoor_Performance_List"
  },
  {
    "conf": "Northern Sunmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/507/Northern_Sun_Indoor_Performance_List"
  },
  {
    "conf": "PSACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/499/PSAC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/504/2009_10_NCAA_Division_III_Indoor_Track__Field"
  },
  {
    "conf": "CUNYACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/496/CUNYAC_Indoor_Performance_List"
  },
  {
    "conf": "DIII New Englandmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/498/DIII_New_England_Indoor_Performance_List"
  },
  {
    "conf": "ECAC DIIImwmenwomen",
    "link": "https://tf.tfrrs.org/lists/497/ECAC_DIII_Indoor_Performance_List"
  },
  {
    "conf": "Empire 8 mwmenwomen",
    "link": "https://tf.tfrrs.org/lists/501/Empire_Eight_Indoor_Performance_List"
  },
  {
    "conf": "HCACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/512/Heartland_Conference_Indoor_Performance_List"
  },
  {
    "conf": "Metsmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/513/Mets_Indoor_Performance_List"
  },
  {
    "conf": "NEICAAAmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/491/NEICAAA_Indoor_Performance_List"
  },
  {
    "conf": "NYSCTCmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/500/NYSCTC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/476/2009_2010_NAIA_Indoor_POP_List_Final_Closed"
  },
  {
    "conf": "Heart of America ACmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/514/Heart_of_America_AC_Indoor_Performance_List"
  },
  {
    "conf": "Indoor Qualifying Listmwmenwomen",
    "link": "https://tf.tfrrs.org/lists/478/2009_2010_NJCAA_Indoor_Performance_List"
  }
];

module.exports = links;



//examples

//scrapeSeasons()

//scrapeConfs(4)

//scrapeConfs(0);

//console.log(links)

const link = "https://tf.tfrrs.org/lists/3857/BIG_EAST_Outdoor_Performance_List"

scrapeConfPerformanceList(link)