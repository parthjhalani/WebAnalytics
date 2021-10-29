using {
  managed
}
from '@sap/cds/common';
namespace sap.naif.microsites.analytics;

@assert.unique: {
  url: [url]
}
entity Pages {
  key ID: UUID @odata.Type:'Edm.String';
  createdAt: Timestamp @cds.on.insert: $now;
  url: String not null;
  
}
entity Hits {
  key ID: UUID @odata.Type:'Edm.String';
  createdAt: Timestamp @cds.on.insert: $now;
  title: String not null;
  userAgent: String not null;
  session: Association to Sessions ;
  vendor : String;
  platform : String;
  pageID: Association to Pages
}
@assert.unique: {
  ID: [ID]
}
entity Sessions {
  key ID: String;
  createdAt: Timestamp @cds.on.insert: $now;
  ipAddress: String not null;
  location:String;
  
  
}

entity Performance {
  key ID: UUID @odata.Type:'Edm.String';
  createdAt: Timestamp @cds.on.insert: $now;
  hits : Association to Hits;
  page: Association to Pages;
  connectStart: Timestamp;
  connectEnd: Timestamp;
  navigationStart: Timestamp;
  loadEventStart: Timestamp;
  loadEventEnd: Timestamp;
  domLoading: Timestamp;
  domComplete: Timestamp;
  secureConnectionStart: Timestamp;
  fetchStart: Timestamp;
  domContentLoadedEventStart: Timestamp;
  domContentLoadedEventEnd: Timestamp;
  responseStart: Timestamp;
  responseEnd: Timestamp;
  domInteractive: Timestamp;
  domainLookupEnd: Timestamp;
  redirectStart: Timestamp;
  redirectEnd: Timestamp;
  requestStart: Timestamp;
  unloadEventEnd: Timestamp;
  unloadEventStart: Timestamp;
  domainLookupStart: Timestamp; 
  totPageLoadTime: Integer; 
  connect: Integer; 
  loadEvent: Integer; 
  domContentLoadedEvent: Integer; 
  redirect: Integer; 
  response: Integer; 
  totRequestResp: Integer; 
}

entity Clicks {
   
  text: String;
  createdAt: Timestamp @cds.on.insert: $now;
  selector: String;
  pageID: Association to Pages ;
  session: Association to Sessions ;
}