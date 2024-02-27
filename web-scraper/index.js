//index.js

//import cheerio and axios
const cheerio = require("cheerio")
const axios = require("axios")

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
                    seas = "INDOOR"
                    seasString = year + " " + seas
                }

                else {
                    seas = "OUTDOOR"
                    seasString = year + " " + seas;
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

    console.log(seasonArray) //change to return 
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

    //fill conference array
    const test = $(".tab-content.py-15")
        .find(".tab-pane:eq(" + index + ")")
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
        .each((index, element) => {
            $(element).find("li").each((index, element2) => {

                var conf = $(element2).find("a").text()
                var link = $(element2).find("a").attr("href")

                const confObj = {
                    conf: conf,
                    link: link
                }

                confArray.push(confObj)
            })
        })

    console.log(confArray)
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










//examples 

//scrapeSeasons()

scrapeConfs(4)

//const link = "https://tf.tfrrs.org/lists/3857/BIG_EAST_Outdoor_Performance_List"

//scrapeConfEvent(link, 1)