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
  session: String ;
  
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
  
  hits: Association to Hits on hits.session = $self.ID
}

entity Performance {
  key ID: UUID @odata.Type:'Edm.String';
  createdAt: Timestamp @cds.on.insert: $now;
  url: String not null;
  page: Association to one Pages on page.url = $self.url;
  connectStart: Timestamp;
  navigationStart: Timestamp;
  loadEventEnd: Timestamp;
  domLoading: Timestamp;
  secureConnectionStart: Timestamp;
  fetchStart: Timestamp;
  domContentLoadedEventStart: Timestamp;
  responseStart: Timestamp;
  responseEnd: Timestamp;
  domInteractive: Timestamp;
  domainLookupEnd: Timestamp;
  redirectStart: Timestamp;
  requestStart: Timestamp;
  unloadEventEnd: Timestamp;
  unloadEventStart: Timestamp;
  domComplete: Timestamp;
  domainLookupStart: Timestamp;
  loadEventStart: Timestamp;
  domContentLoadedEventEnd: Timestamp;
  redirectEnd: Timestamp;
  connectEnd: Timestamp
}

entity Clicks {
  text: String;
  selector: String;
  session: String;
}