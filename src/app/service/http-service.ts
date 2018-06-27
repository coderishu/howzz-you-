import {Http,Response,Headers,RequestOptions,ResponseContentType} from '@angular/http';
import {Injectable,ViewChild} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';
declare var $:any;

@Injectable()
export class DataService{
    // private _dataURL : string = 'http://localhost/wordpress/?rest_route=/wp/v2/posts';
    // posts : PostInterface [];
    // post : PostInterface;
    // errorMessage : string;

    constructor(private http:Http){
        var obj;
         this.getJSON().subscribe(data => obj=data, error => console.log(error));
    }
public getJSON(): Observable<any> {
         return this.http.get("./file.json")
                         .map((response: Response) => {
            console.log("mock data" + response.json());
            return response.json();
        }
    )
    // .catch(this.handleError);

     }
    // getPosts():Observable<any[]>{
    //     //return this.http.get(this._dataURL).map((res:Response) => res.json());
    //     return this.http.get(this._dataURL)
    //         .map(res=>{
    //           if(res.json()){
    //             return res.json()
    //           }
    //         });
    //         //.do(data => console.log(data)) // eyeball results in the console
    //         .catch(this.handleError);



createGetRequest(url:string){
      // console.log("from get request=="+this.loader.getStatus());

        return this.http.get(url).map((res:Response)=>res.json());
    }

    createtPostRequest(url:any,data:any){

        let deferred = $.Deferred();
   let cThis = this;
    $.ajax({
     url:url,
     type:"Post",
     dataType:"json",
     data:data,
     success:function(response){

     deferred.resolve(response)
     },
     error:function(error){



     }
    })
    return deferred.promise();

}

}





