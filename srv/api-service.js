const cds = require('@sap/cds')
const session = module.require('express-session');
      cds.app.use(session({secret: "NA Innovation Advisory"}));


module.exports = (srv)=>{
srv.before('CREATE', 'Hits', (req)=>{
    
     cds.app.enable('trust proxy') ;
      const geoip = module.require('geoip-lite');
      
      const {Pages} = cds.entities ('sap.naif.microsites.analytics');
      const {Sessions} = cds.entities ('sap.naif.microsites.analytics');
      const request = req._.req;
      var ip = request.ip;
      var geo = geoip.lookup(ip);
      const tx = cds.transaction(req);
    const fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
    
      tx.run(SELECT.from(Pages).where({URL: fullUrl})).then(function(PageDetails){
        let timestamp = new Date().toISOString().replace('Z', '');
        if(PageDetails.length === 0){
            console.log(PageDetails);
            tx.run(INSERT.into(Pages).columns ('createdAt','url' ) 
                    .values ( timestamp, fullUrl)).then(function(pageid){
                         req.data.pageID_ID = pageid.results[0].values[0]
                    })
          }else{
            req.data.pageID_ID = PageDetails[0].ID;
          }
          
          const sessionid = request.session.id;
          req.data.session = sessionid;
          
          
          tx.run(SELECT.from(Sessions).where({ID: sessionid})).then(function(SessionDetails){
                if(SessionDetails.length === 0){
                    tx.run(INSERT.into(Sessions).columns ('ID','createdAt','ipAddress','location') 
                            .values ( sessionid, timestamp, request.ip,geo))
                }
          });

      });

});

}