  import { Injectable } from '@angular/core';
  import { HttpService } from './http-service';
  import {appConstant} from '../constant/app.constant';
  import {saveAs as importedSaveAs} from 'file-saver';
 //import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class OrderService {
defaultAdress:any;
defaultBillingAddress:any;
TotalAddressLength:any;
 constructor(private httpService:HttpService ){
  
}
downLoadPdf(orderDetail){
  this.getInvoice(orderDetail)
}
   getInvoice(orderDetail:Object){
  
    //let userDetail = JSON.parse(localStorage.getItem('currentUser'));
  
  let URL =  appConstant.baseUrl+'front/order/invoice_html';
  let data = {lang:orderDetail['lang'],lang_id:orderDetail['lang_id'],id:orderDetail['id'],order_detail_id:orderDetail['order_detail_id']};
  //let encrypt_data = this.encryptionservice.encrypt_data(data);
  //console.log(orderId)
  
      this.httpService.createPostRequestForTextHtml(URL,data).subscribe(response=>{
      this.sendPdfHtml(response,orderDetail);
     
 });
 }
 sendPdfHtml(response:any,orderDetail:Object){
 // alert(1)
    let URL =   appConstant.baseUrl+'front/order/invoice_pdf';
  let data = {lang:orderDetail['lang'],lang_id:orderDetail['lang_id'],id:orderDetail['id'],order_detail_id:orderDetail['order_detail_id'],res_data:response};
 // let encrypt_data = this.encryptionservice.encrypt_data(data);
  //console.log(orderId)
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      if(response.status){
        this.downLoadInvoicePdf(response.data);
        }
        else{
        //  this.globaldata.showToaster({type:'error',body:response.msg});
          }
 });
}
downLoadInvoicePdf(url){
    
 
  //console.log(orderId)
   this.httpService.downloadFile(url).subscribe(blob=>{
      importedSaveAs(blob, 'invoice');
     
 });
}
 
}