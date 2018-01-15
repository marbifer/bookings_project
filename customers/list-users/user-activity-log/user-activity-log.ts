import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { Widget } from '../../../core/widget/widget';
import { RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import { Observable } from 'rxjs/Observable';
import { CustomHttp } from '../../../services/http-wrapper';
import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { NgClass } from '@angular/common';
import { Core } from '../../../core/core';
import { Location } from '@angular/common';
import myGlobals = require('../../../../app');
import { LoadingGif } from '../../../bworkspace/filedetail/loading_gif.service';
import { RolloverAutocompletes } from '../../../customers/rollovers-dropdown.service';
import { DataPropertiesUserActivityLog } from './data_properties.service';
import { TitleService } from '../../../core/navbar/titles.service';
import { myPagination } from '../../../settings/pagination-mappings/pagination.subcomponent';
import { DataPagination } from '../../../settings/pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;
export var filter: string="";

@Component({
  selector: '[user-activity-log]',
  template: require('./user-activity-log.html'),
  directives: [ROUTER_DIRECTIVES, [NgClass], [Widget], [myPagination]],
  styles: [require('./user-activity-log.scss')],
  providers:[DataPagination]
})

export class UserActivityLog {

    @ViewChild('pagination') myPag;
    showPagination: boolean = false;
    current_url = this._loc.path(); //Current Url
    title_page: any; //Title page
    id:any;
    title_name: any = '';
    myUrl: string;
    public elementRef;

    //Date Range
    date_range_start: any = '';
    date_range_end: any = '';

    //Export to excel
    excel_string: string;

    //Control width of screens
    view_port_width_book = true;
    it_come_from: any; //Indicate if user comes from cliking agency name

    constructor( 
      public _data_pagination: DataPagination, 
      public http: Http, 
      public params: RouteParams, 
      public router: Router, 
      private ngZone: NgZone, 
      myElement: ElementRef,
      viewContainer: ViewContainerRef,
      public _titleService: TitleService, 
      public _loc: Location, 
      public load: LoadingGif, 
      public _rol: RolloverAutocompletes, 
      public _service: DataPropertiesUserActivityLog
    ) { 
        //Store imported Title in local title
        this.title_page = _titleService.title_page;
        this.elementRef = myElement; //Autocomplete
    } //Close constructor

    changeMyTitle() {
        this._titleService.change('Users/Activity Log - ' + this.title_name);
        console.log('User Title: ' + this._titleService.title_page);
    }

  ngOnInit() { 
      this._service.total_page = undefined; //Set as initial state if user back here after click on another menu item
      if (this._loc.path().indexOf(";") != -1 ) {
        this.myUrl = this._loc.path().slice(0,this._loc.path().indexOf(";"));
      } else {
          this.myUrl = this._loc.path();
      }
      /////////////////////////////////////////
      /// DATEPICKERS DATE RANGE START/FROM ///  
      var _those = this;
      var locale = "en-us";
      $("#date-range-start").datepicker({autoclose: true, format: "dd-M-yyyy"}).on('changeDate', function(e){ 
         var id = _those.params.get('id');

         ///////////////////////////////////////////
         /// Send date to backend formated Start ///
         var new_date = e.format(); 

          new_date = new Date(new_date); //Full time standard
          new_date = new_date.toISOString(); //ISO format
          var date = new Date(new_date);
          var year:any = date.getFullYear();
          var month:any = date.getMonth()+1;
          var dt:any = date.getDate();

          if (dt < 10) {dt = '0' + dt;}
          if (month < 10) {month = '0' + month;}
          new_date  = year+'-' + month + '-'+dt;

        _those._service.date_range_start = new_date;

        /////////////////////////////////////////
        /// Send date to backend formated end ///
        console.log('aquiiii: ' + _those.params.get('cp'));
       
        _those.date_range_start = e.format(); 
        if(_those.date_range_end != ''){ //If different from empty
          var from = new Date(_those.date_range_start);
          var to = new Date( _those.date_range_end);  
          if(from > to){ //If Date from is bigger than Date To        
            from.setDate(from.getDate() + 7); //Add seven Days to Date Create To     
            var month: any = from.toLocaleString(locale, { month: "short" }); //Get Short name of Month      
           _those.date_range_end = from.getDate()+'-'+ month +'-'+ from.getFullYear();
            _those._service.date_range_end = _those.date_range_end;
          }
        } 
        $('#date-range-end').datepicker('destroy');
        $('#date-range-end').datepicker({autoclose: true, format: "dd-M-yyyy", startDate: _those.date_range_start});   
       
         _those._service.get_activity_logs(id, {page: _those.params.get('cp')})
        .map(data => {    
              _those.recursive_check_pagination(data);                 
        }).subscribe();

     }); //Close first function

    /////////////////////////////////////
    /// DATEPICKERS DATE RANGE END/TO ///  
    $("#date-range-end").datepicker({autoclose: true, format: "dd-M-yyyy"}).on('changeDate', function(e){ 
      _those.date_range_end = e.format();   
      var id = _those.params.get('id');
      var new_date = e.format(); 

      new_date = new Date(new_date); //Full time standard
      new_date = new_date.toISOString(); //ISO format
      var date = new Date(new_date);
      var year:any = date.getFullYear();
      var month:any = date.getMonth()+1;
      var dt:any = date.getDate();

      if (dt < 10) {dt = '0' + dt;}
      if (month < 10) {month = '0' + month;}
      new_date  = year+'-' + month + '-'+dt;
      
      _those._service.date_range_end = new_date ;
      _those._service.get_activity_logs(id, {page: _those.params.get('cp')})
      .map(data => {    
            _those.recursive_check_pagination(data);                 
      }).subscribe();

    }); //Close first function

    /////////////////////////////////////////////
    /// Open component at the top of the page ///
    $('html, body').animate({
        scrollTop: $("#scrollToHere").offset().top
    }, 0);

    const searchBox = document.getElementById('city');
    const searchLetters = Observable
      .fromEvent(searchBox, 'keyup');
   
    var id = this.params.get('id');
    this.title_name = this.params.get('name');
    this.changeMyTitle(); //Update Title

    ///////////////////
    /// PAGINATION ///
    if ( this.params.get('cp') ) {
        
        setTimeout(()=>{
            this._service.get_activity_logs(this.params.get('id'), { page: this.params.get('cp') })
            .map(data => {    
                if ( data.numbers_of_pages > 1 ) {
                  this.recursive_check_pagination(data);       
                }          
            }).subscribe();
        });
    } else {
        setTimeout(()=>{
            this._service.get_activity_logs(this.params.get('id'), { page: 1 })
            .map(data => {    
                if ( data.numbers_of_pages > 1 ) {
                  this.recursive_check_pagination(data);                
                }
            }).subscribe();
        });
    } //Close if and else

  } //Close ngOnInit

current_page_change(data){
        this._service.get_activity_logs(this.params.get('id'), { page: data.selectedPage, type: data.type})
        .map(json_response =>
            this.myPag.pagination_mappings({
                 event : 'select',
                 _data_pagination : json_response
            })).subscribe(); 
        this._loc.go(this.myUrl+';id='+this.params.get('id')+';name='+this.params.get('name')+';cp='+data.selectedPage);
       //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

///////////////////////////////
/// Request Export to excel ///
export_to_excel(){
  let url = myGlobals.host+'/api/admin/customers/user/activity_log/export_to_excel';
    let body=JSON.stringify({id_user: this._service.id_user, date_start: this.date_range_start, date_end: this.date_range_end });
    console.log('Body del request del export_to_excel: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe(
        response => {
            this.excel_string = myGlobals.host+response.json().excel;
            var excel_name=response.json().excel_name;

            var uri = this.excel_string;
            window.open(uri, 'Download');
                console.log('Excel: '+this.excel_string);
        }, error => {}
    );
} //close method export_to_excel

    ngAfterViewInit(){ 
        if ( this.params.get('fromUserLink') == 'y' ) {
            setTimeout(()=>{
                let goTo = $('#goUser').offset().top + 20;
                $("html, body").animate({scrollTop: goTo}, 1500, 'swing');
            }, 3150);
        }
    } //Close ngAfterViewInit

    recursive_check_pagination(data){
      this.showPagination = true;
      if (this.myPag != undefined){
        if (data.numbers_of_pages > 1) {
            this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
        } else {
           this.showPagination = false;
        }
      } else {
        setTimeout(()=>{
            this.recursive_check_pagination(data);
        }, 400);
      }
    }

  ///////////////////////////////
  /// Add line in Datepicker ///
  line_picker(){
    jQuery('#new-row').remove();
    var selector_row ='table.table-condensed thead tr:nth-child(2)';
    jQuery(selector_row).after('<tr id="new-row"><td id="no-space" colspan="7"><hr class="line-date"></td></tr>'); 
  }

} //Close class UserActivityLog
