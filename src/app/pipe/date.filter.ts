import {Component,PipeTransform,Pipe} from '@angular/core';
@Pipe({name:"dateFilter"})
export class DateFilter implements PipeTransform{
    transform(date:Date,type:string):string{
        let dateOb = new Date(date);
        let time = this.getTime(dateOb.toLocaleTimeString());
       // alert(dateOb.toLocaleTimeString());
        let year = dateOb.getFullYear();
        let month = dateOb.getMonth()+1;
        let day = dateOb.getDay();
        //if(type === 'ticket')
       // return day+' '+this.getMonth(month).toUpperCase()+' '+year;
       // else
        return dateOb.getDate()+','+this.getMonth(month)+','+year+' '+time;
        

    }
    getDay(day){
        let currentDay = '';
        switch(day){
       case 1 :
       currentDay = 'Mon';
       break;
       case 2 :
       currentDay = 'Tue';
       break;
       case 3 :
       currentDay = 'Wed';
       break;
       case 4 :
       currentDay = 'Thu';
       break;
       case 5 :
       currentDay = 'Fri';
       break;
       case 6 :
       currentDay = 'Sat';
       break;
       case 7 :
       currentDay = 'Sun';
       break;
        }
        return currentDay;
    }
    getMonth(month){
        let currentMonth = ''
        switch(month){
            case 1 :
            currentMonth = 'Jan';
            break;
            case 2 :
            currentMonth = 'Feb';
            break;
            case 3 :
            currentMonth = 'Mar';
            break;
            case 4 :
            currentMonth = 'Apr';
            break;
            case 5 :
            currentMonth = 'May';
            break;
            case 6 :
            currentMonth = 'Jun';
            break;
            case 7 :
            currentMonth = 'Jul';
            break;
            case 8 :
            currentMonth = 'Aug';
            break;
            case 9 :
            currentMonth = 'Sep';
            break;
            case 10 :
            currentMonth = 'Oct';
            break;
            case 11 :
            currentMonth = 'Nov';
            break;
            case 12 :
            currentMonth = 'Dec';
            break;

        }
        return currentMonth;
    }
    getTime(time){
        let timeString = time;
        let H = +timeString.substr(0, 2);
        let h = H % 12 || 12;
        let ampm = (H < 12 || H === 24) ? "AM" : "PM";
        timeString = h + timeString.substr(2, 3) + ampm;
        return timeString;
    }
}