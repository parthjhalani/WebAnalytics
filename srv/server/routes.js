const cds = require('@sap/cds');

module.exports = {
    API: function (app) {

        // console.log("NODE_ENV: " + process.env.NODE_ENV)
        // if (process.env.NODE_ENV === "development")
        //     app.use(cors());

        app.post("/page", async function (request, response) {
            // app.get("/:siteUrl/:pageUrl", function (request, response, next) {
            console.log("route: /page")
            // response.send(await logPage(request))
            let result = await  logPage(request)
            response.setHeader('Content-Type', 'application/json');
            response.end(result);
        });
        app.post("/clicks", async function (request, response) {
            // app.get("/:siteUrl/:pageUrl", function (request, response, next) {
            console.log("route: /page")
            // response.send(await logPage(request))
            let result = await  logClicks(request)
            response.setHeader('Content-Type', 'application/json');
            response.end(result);
        });

        return app;
    }
}
async function logPage(request) {
    try {
        let startTime = new Date()

        console.log(`IP: ${request.ip}`)

        // console.log('request.body')
        // console.log(request.body)

        let result = request.body
        const geoip = module.require('geoip-lite');
      
      //const {Pages} = cds.entities ('sap.naif.microsites.analytics');
      //const {Sessions} = cds.entities ('sap.naif.microsites.analytics');
      
      var ip = request.ip;
      var geo = geoip.lookup(ip);
      //const tx = cds.transaction(req);
        const fullUrl = result.url;//request.protocol + '://' + request.get('host') + request.originalUrl;
        result.ip = request.ip
        result.sessionID = request.session.id
        console.log(result)
        let timestamp = new Date().toISOString().replace('Z', '');
        let pageID,sessionID , hitID;
        
        pageID = await getPageID(fullUrl,timestamp);
        
        let sessionQuery = {SELECT:{
                from: {ref:["sap.naif.microsites.analytics.Sessions"]},
                columns: [
                    {ref:["ID"]}
                ],
                where: [{ref:["ID"]}, "=", {val: result.sessionID }]
                }}
        
        let sessionIdOnQuery = await cds.run(sessionQuery);

        if(sessionIdOnQuery === null || sessionIdOnQuery.length === 0 || !sessionIdOnQuery){
            let SessionInsertQuery = {INSERT:{
                into: { ref: ["sap.naif.microsites.analytics.Sessions"] },
                columns: [ 'ID','createdAt','ipAddress','location'],
                values: [ result.sessionID, timestamp, request.ip,geo ]
                }};
                console.log(SessionInsertQuery);
                let SessionInsert = await cds.run(SessionInsertQuery);
                sessionID = SessionInsert.results[0].values[0];
        }else{
            sessionID = result.sessionID ;
        }
        
        let HitsInsertQuery = {INSERT:{
                into: { ref: ["sap.naif.microsites.analytics.Hits"] },
                columns: [ 'createdAt','title','userAgent','vendor','platform' ,'session_ID', 'pageID_ID'],
                values: [ timestamp, result.pageTitle,result.userAgent,result.vendor,result.platform,sessionID, pageID]
                }};
                let HitsInsert = await cds.run(HitsInsertQuery);
                hitID = HitsInsert.results[0].values[0];

    

                let PerfInsertQuery =  getPerformanceInsertQuery(timestamp,hitID,pageID,result);
                 await cds.run(PerfInsertQuery);
                //perfID = PerfInsert.results[0].values[0];




        console.log(`logPage ran in: ${new Date() - startTime}ms`);

        return JSON.stringify( result )

        // if (result.content != null && result.content != '') {
        //     return result.content
        // } else {
        //     return result.template.content
        // }

    } catch (error) {
        console.error(error)
        return {
            error: 'logPage error',
            message: error.message
        }
    }
}
async function getPageID(fullUrl,timestamp){
    let pageID;
    let PageQuery = {SELECT:{
                from: {ref:["sap.naif.microsites.analytics.Pages"]},
                columns: [
                    {ref:["ID"]}
                ],
                where: [{ref:["url"]}, "=", {val: fullUrl}]
                }}
        
        let pageIdOnQuery = await cds.run(PageQuery);

        if(pageIdOnQuery === null || pageIdOnQuery.length === 0 || !pageIdOnQuery){
            let PageInsertQuery = {INSERT:{
                into: { ref: ["sap.naif.microsites.analytics.Pages"] },
                columns: [ 'createdAt','url'],
                values: [ timestamp, fullUrl ]
                }};
                console.log(PageInsertQuery);
                let PageInsert = await cds.run(PageInsertQuery);
                pageID = PageInsert.results[0].values[0];
        }else{
            pageID = pageIdOnQuery[0].ID ;
        }
        return pageID;
}
function getPerformanceInsertQuery(timestamp,hitID,pageID,result){
    let cqn = {INSERT:{
                into: { ref: ["sap.naif.microsites.analytics.Performance"] },
                columns: [ 'createdAt','hits_ID','page_ID','connectStart','connectEnd', 'navigationStart', 'loadEventStart',
                            'loadEventEnd','domLoading','domComplete','secureConnectionStart','fetchStart', 'domContentLoadedEventStart', 'domContentLoadedEventEnd',
                            'responseStart','responseEnd','domInteractive','domainLookupEnd','redirectStart', 'redirectEnd', 'requestStart',
                            'unloadEventEnd','unloadEventStart','domainLookupStart','totPageLoadTime', 'connect', 'loadEvent', 'domContentLoadedEvent',
                            'redirect','response','totRequestResp'
            ],
               values: [ timestamp,hitID,pageID,new Date(result.timing.connectStart).toISOString().replace('Z', ''),new Date(result.timing.connectEnd).toISOString().replace('Z', ''),new Date(result.timing.navigationStart).toISOString().replace('Z', ''),new Date(result.timing.loadEventStart).toISOString().replace('Z', ''),
                        new Date(result.timing.loadEventEnd).toISOString().replace('Z', ''),new Date(result.timing.domLoading).toISOString().replace('Z', ''),new Date(result.timing.domComplete).toISOString().replace('Z', ''),new Date(result.timing.secureConnectionStart).toISOString().replace('Z', ''),
                        new Date(result.timing.fetchStart).toISOString().replace('Z', ''),new Date(result.timing.domContentLoadedEventStart).toISOString().replace('Z', ''),new Date(result.timing.domContentLoadedEventEnd).toISOString().replace('Z', ''),new Date(result.timing.responseStart).toISOString().replace('Z', ''),
                        new Date(result.timing.responseEnd).toISOString().replace('Z', ''),new Date(result.timing.domInteractive).toISOString().replace('Z', ''),new Date(result.timing.domainLookupEnd).toISOString().replace('Z', ''),
                        new Date(result.timing.redirectStart).toISOString().replace('Z', ''),new Date(result.timing.redirectEnd).toISOString().replace('Z', ''),new Date(result.timing.requestStart).toISOString().replace('Z', ''),new Date(result.timing.unloadEventEnd).toISOString().replace('Z', ''),
                        new Date(result.timing.unloadEventStart).toISOString().replace('Z', ''),new Date(result.timing.domainLookupStart).toISOString().replace('Z', ''),(result.timing.responseEnd - result.timing.fetchStart),(result.timing.connectEnd - result.timing.connectStart),
                        (result.timing.loadEventEnd - result.timing.loadEventStart),(result.timing.domContentLoadedEventEnd - result.timing.domContentLoadedEventStart),(result.timing.redirectEnd - result.timing.redirectStart),(result.timing.responseEnd - result.timing.responseStart),(result.timing.responseEnd - result.timing.requestStart)
                    ]
                }}
        return cqn;
}
async function viewFunc(params) {
    try {
        let startTime = new Date()
        console.log('viewFunc')

        // console.log('params')
        // console.log(params)

        let site = await cds.run(SELECT.one.from('Sites', site => {
            site.title, site.createdBy, site.pages(page => {
                page.content, page.template_ID
            }).where({
                pageUrl: params.pageUrl
            })
        }).where({
            siteUrl: params.siteUrl
        }));
        // console.log('site')
        // console.log(site)

        
        if (site == null || site.pages.length == 0) {
            throw {
                message: `Could not find a page for path: /${params.siteUrl}/${params.pageUrl}`
            }
        }

        let content = null

        if (site.pages[0].content != null && site.pages[0].content != '' ) {
            //use page content, or...
            console.log("no content not null")
            // console.log(site)
            content = site.pages[0].content
        } else {
            console.log("no content yet, get template")
            // ...else use page template content instead
            let template = await cds.run(SELECT.one.from('Templates').where({
                ID: site.pages[0].template_ID
            }));
            // console.log('template')
            // console.log(template)
            content = template.content
        }

        //inject site variables into HTML
        content = content.replace(/{{title}}/g, site.title)
        content = content.replace(/{{createdBy}}/g, site.createdBy)

        return content

    } catch (error) {
        console.error('viewFunc error:')
        console.error(error)
        return {
            error: "viewFunc error",
            message: error.message
        }
    }
}


async function logClicks(request){
    try {
         let startTime = new Date()

        let result = request.body;
        let timestamp = new Date().toISOString().replace('Z', '');
        let fullUrl = result.url;
        let pageID = await getPageID(fullUrl,timestamp);
        result.sessionID = request.session.id
        let clicksInsertQuery = {INSERT:{
                into: { ref: ["sap.naif.microsites.analytics.Clicks"] },
                columns: [ 'text','createdAt','selector' ,'session_ID', 'pageID_ID'],
                values: [ result.text, timestamp, result.selector,result.sessionID,pageID ]
                }};
                console.log(clicksInsertQuery);
                await cds.run(clicksInsertQuery);

        console.log(`logClicks ran in: ${new Date() - startTime}ms`);

        return JSON.stringify( result )
                
         } catch (error) {
        console.error(error)
        return {
            error: 'Error in Logclicks',
            message: error.message
        }
    }
}