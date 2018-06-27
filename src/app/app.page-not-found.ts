// import { Component } from '@angular/core';
// import {Router,ActivatedRoute} from '@angular/router';


// @Component({
//   selector: 'ng-view',
//   template: `<div class = "content page-not-found"><h1>Page Not Found </h1> </div>`
//   // styleUrls: ['./app.component.css']
// })
// export class PageNotFound {
// //   constructor(private _redirectServices: RedirectServices) {

// // }
 
// }


import {Component} from "@angular/core";

@Component({selector:'ng-view',
template:`<div class = "page-not-found">
<h2>404</h2>
<h3>Page Not Found</h3>
<p class="errorurl">You may have an error writing the url</p>
 </div>`})
export class PageNotFound{

}