import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , Input, Output, ViewChild , OnDestroy} from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Core} from '../../core/core';
import {Location} from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {datepickerConfig} from './datepicker_config.service';

declare var jQuery: any;
declare var $: any;

///////////
/// IFE ///
@Component({
  selector: 'all-datepicker',
  template: require('./datepicker.html'),
  styles: [require('./datepicker.scss')],
  //encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, [Widget]],
  providers: [datepickerConfig]
})

export class allDatepicker {
    //Date Range
    date_range_start: any;
    date_range_end: any;
    from: any;
    to: any;
    from_text_input: any = [];
    to_text_input: any = [];
    sele;
    are_not_completes = true;
    border_error_from = false;
    border_error_to = false;
 
    constructor(
      public http: Http,
      public params: RouteParams,
      public router: Router,
      public load: LoadingGif, 
      viewContainer: ViewContainerRef,
      public location: Location,
      private ngZone: NgZone,
      public _config: datepickerConfig
    ) {} //Close constructor

@Input() type;
@Input() indexer; //Datepicker Step 4
@Output() onDatePicked: EventEmitter<any> = new EventEmitter<any>();
@Output() fillFrom: EventEmitter<any> = new EventEmitter<any>(); //Notify when From input is filled
@Output() fillTo: EventEmitter<any> = new EventEmitter<any>(); //Notify when To input is filled

  ngAfterViewInit(){
  this.datepicker_inicialization()
  }

  ngOnInit(){ 
    this._config.init_configuration(this.type);
    this.datepicker_inicialization();    
 } //Close ngOnInit

  datepicker_inicialization(){

    this._config.init_configuration(this.type);

    /////////////////////////////////////////////////////////////////////
    /// FERNANDA STEP 4: DATEPICKERS DATE RANGE START/FROM AND END/TO /// 
    var locale = "en-us";
    
    $('#date-range-start' + this.type + this.indexer).datepicker({autoclose: true, format: "dd-M-yyyy"}).on('changeDate', (e)=>{ 
      this.from_text_input[this.indexer] = true; //Hide input text "From"
      this.from = this.format_date(e.format()); //Format ready to send to backend
      //console.log('frommmmmmm: ' + this.from);   
      this.date_range_start = e.format(); 
      if(this.date_range_end != ''){ //If different from empty
        var from = new Date(this.date_range_start);
        var to = new Date(this.date_range_end);  
        if(from > to){ //If Date from is bigger than Date To        
          from.setDate(from.getDate() + 7); //Add seven Days to input To     
          var month = from.toLocaleString(locale, { month: "short" }); //Get Short name of Month        
          this.date_range_end = from.getDate()+'-'+ month +'-'+ from.getFullYear(); 
        }
      }

      $('#date-range-end' + this.type + this.indexer).datepicker('destroy');
      //setTimeout(()=>{
         $('#date-range-end' + this.type + this.indexer).datepicker({autoclose: true, format: "dd-M-yyyy", startDate: this.date_range_start});      
      //}, 200);
      this.border_error_from = false;  //Remove border error from
      this.filled_from();
    }); //Close first function

    $('#date-range-end' + this.type + this.indexer).datepicker({autoclose: true, format: "dd-M-yyyy"}).on('changeDate', (e)=>{
      this.to = this.format_date(e.format()); //Format ready to send to backend
      this.to_text_input[this.indexer] = true; //Hide input text "To" 
      console.log('tooooooo: ' + this.to);    
      this.date_range_end = e.format(); 
      this.border_error_to = false; //Remove border error To
      this.filled_to();
    }); //Close second function
  }

  format_date(selected_date){
    if(selected_date != ''){
      selected_date = new Date(selected_date); //Full time standard
      selected_date = selected_date.toISOString(); //ISO format
      var date = new Date(selected_date);
      var year:any = date.getFullYear();
      var month:any = date.getMonth()+1;
      var dt:any = date.getDate();

      if (dt < 10) {dt = '0' + dt;}
      if (month < 10) {month = '0' + month;}
      return selected_date  = year+'-' + month + '-'+dt;
    } else if(selected_date == '' || selected_date == undefined){
      return selected_date = '';
    }
  }

  ///////////////////////////////////////////
  /// Notify parent component Date picked /// 
  filled_from(){ 
    if(this.date_range_start != undefined && this.date_range_end != undefined && this.date_range_start != '' && this.date_range_end != ''){
      this.are_not_completes = false;
    } else {
      this.are_not_completes = true;
    } 
    this.onDatePicked.emit(this.are_not_completes);
    this.fillFrom.emit('from');
  }

  filled_to(){  
    if(this.date_range_start != undefined && this.date_range_end != undefined && this.date_range_start != '' && this.date_range_end != ''){
      this.are_not_completes = false;
    } else {
      this.are_not_completes = true;
    } 
    this.onDatePicked.emit(this.are_not_completes);
    this.fillTo.emit('To');
  }

  notifyMe(){}

  //////////////////////////////
  /// Add line in Datepicker ///
  line_picker(){
    jQuery('#new-row').remove();
    var selector_row ='table.table-condensed thead tr:nth-child(2)';
    jQuery(selector_row).after('<tr id="new-row"><td id="no-space" colspan="7"><hr class="line-date"></td></tr>'); 

    $('.html, body').one("scroll", function() {
      jQuery('#date-range-start' + this.type + this.indexer).datepicker('remove');
      jQuery('#date-range-end' + this.type + this.indexer).datepicker('remove');
    });
  }

  empty_text(){
    if(this.date_range_start != undefined){
      this.from_text_input[this.indexer] = true; //Hide input text "From"
      this.to_text_input[this.indexer] = true; //Hide input text "To" 
    }
  }

  show_text(){
     this.from_text_input[this.indexer] = false; //Show input text "From"
     this.to_text_input[this.indexer] = false; //Show input text "To" 
  }

  reset_dates(i){
    this.indexer = this.indexer -1;
    //console.log('this.date_range_start'+i +': ' + this.date_range_start);
    //this.date_range_start= undefined;
    //this.date_range_end= undefined;
    //console.log('this.date_range_start completo' + this.date_range_start);

  }

} // Close class allDatepicker
