using { sap.naif.microsites.analytics as db } from '../db/schema';
using {sap} from '@sap/cds/common';

service ApiService 
@(
  impl     : './api-service.js',
  requires : [
    'authenticated-user'
  ])  
{
  entity Pages as projection on db.Pages;
  entity Hits as projection on db.Hits;
  entity Sessions as projection on db.Sessions;
  entity Performance as projection on db.Performance;
  entity Clicks as projection on db.Clicks;
}

// annotate ApiService.Sites with @(restrict: [
//   { grant: ['*'], to: ['admin'] },
//   { grant: ['*'], to: ['author'], where: 'CreatedBy = $user' }
// ]);
// annotate ApiService.Pages with @(restrict: [
//   { grant: ['*'], to: ['admin'] },
//   { grant: ['*'], to: ['author'], where: 'CreatedBy = $user' }
// ]);
// annotate ApiService.Templates with @(restrict: [
//   { grant: ['*'], to: ['admin'] },
//   { grant: ['READ'], to: ['authenticated-user']},
//   { grant: ['*'], to: ['designer'], where: 'CreatedBy = $user' }
// ]);
// annotate ApiService.Components with @(restrict: [
//   { grant: ['*'], to: ['admin'] },
//   { grant: ['READ'], to: ['authenticated-user']},
//   { grant: ['*'], to: ['designer'], where: 'CreatedBy = $user' }
// ]);
// annotate ApiService.ComponentCategories with @(restrict: [
//   { grant: ['*'], to: ['admin'] },
//   { grant: ['READ'], to: ['authenticated-user']},
// ]);
// annotate ApiService.UserScopes with @(restrict:[
//   {grant: ['READ'], to: ['authenticated-user']}
// ]);