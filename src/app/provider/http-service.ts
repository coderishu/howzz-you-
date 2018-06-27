import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Injectable, ViewChild } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Rx';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';

import { EncriptData } from './encription';
declare var $: any;

@Injectable()
export class HttpService {
    // private _dataURL : string = 'http://localhost/wordpress/?rest_route=/wp/v2/posts';
    // posts : PostInterface [];
    // post : PostInterface;
    // errorMessage : string;

    constructor(private http: Http,private encryption:EncriptData,private httpClient:HttpClient)
     {
   
    }

   downloadFile(url): Observable<Blob> 
   {
    let options = new RequestOptions({responseType: ResponseContentType.Blob });
    return this.http.get(url,options)
        .map(res => res.blob())
   }

createPostRequestForTextHtml(url,requestdata) { 
    let headers = new Headers({ 'Content-Type': 'text/html'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, requestdata, options)
          .map(data => {
             return data;
      },error => {
        console.log(error);
    });
  

}


    createGetRequest(url: string) {
        // console.log("from get request=="+this.loader.getStatus());

        return this.http.get(url).map((res: Response) => res.json());
    }
    createPostRequest(url: any, data: any):Observable<any> {
       // let bodyString = JSON.stringify(data); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option
   
        let httpHeaders = new HttpHeaders()
                         .set('Accept', 'application/json');
        let httpParams = new HttpParams().set('category', 'dddd');

        data['lang'] = 'EN';
        data['lang_id'] = '5971c086c7ab557d5c71024e';
        return this.httpClient.post(url, data, {headers:httpHeaders,responseType:'json'})
         // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    

    createPostWithFile(url,data){
        
      
      // .map((res: any) => (res.text() != "" ? res.json() : {}));
        
        let deferred = $.Deferred();
     $.ajax({
         url:url,
         type:"Post",
         dataType:"json",
         data:data,
         contentType: false,
         cache: false,
         processData:false,
         success:function(response){
             
         deferred.resolve(response)
         },
         error:function(error){
             
          
         }
        })
        return deferred.promise();
    }

    // createPostWithFile2(url,data){
    //     let headers = new Headers({ 'Content-Type': 'multipart/form-data'});
    //     let options = new RequestOptions({ headers: headers});
    //     return this.http.post(url, data, options)
    //     .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
    //     .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    // }
}





