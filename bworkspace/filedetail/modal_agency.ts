import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, NgZone } from '@angular/core';
import {Widget} from '../../core/widget/widget';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import { Location } from '@angular/common';
import myGlobals = require('../../../app');
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../customers/rollovers-dropdown.service';
import {DataProperties} from '../../bworkspace/filedetail/data_properties.service';
import {RecordLocator} from '../../bworkspace/filedetail/inlineediting/editlocator.service';
import {EditPassenger} from '../../bworkspace/filedetail/inlineediting/editpassenger.service';
import {TitleService} from '../../core/navbar/titles.service';
import {filter} from '../filter';
  
declare var jQuery: any;
declare var $: any;
declare var VS: any;

/////////////////////////////////////////////////////////////////
///Modal Agency ///

@Component({
  selector: 'modal-agency',
  template: require('./agencymodal/modal_agency.html'),
  styles: [require('./agencymodal/modal_agency.scss')],
  host: {
        '(document:click)': 'handleClick($event)',
  },
  directives: [ [Widget]],
  providers:[] 
})

export class ModalAgency {

//Control width of screens
view_port_width_book = true;

//First Request open Modal with data
agencyname: string="";
recordlocator: string="";

//Second Request Autocomplete Agency field
public agencyCode = "";
public singleArray=[];
public list_of_agencies = [];
public list_of_codes_agency = [];
public filteredListAgency = [];
public elementRef;

//Third Request Autocomplete Operator field
public operatorCode = "";
public operatorName = "";
public operatorLastName = "";
public operatorCount: any;
public list_of_operators = [];
public list_of_codes = [];
public list_of_operators_first = [];
public list_of_operators_last = [];
public filteredListOperator = [];

//Fourth Request Autocomplete Locator field
public locatorCount: any;
public list_of_locators = [];
public filteredListLoc = [];

//Disable or Enabled Input Locator: radio Buttons "Use an Existing Locator" and "Generate New Locator"
disabled_loc = false; //It's enabled
is_new_locator= false; //existing locator by default

//Hide or show to INFO message field Operator
info_on = false; 

//Errors Message
general_error1: string=''; //First Request GET Agency and Locator
field_agency2: string=''; //Second Request Autocomplete Agency
exist_error_agency2: boolean; //Second Request
message_agencies2: string=''; //Second Request

field_operator3: string=''; //Third Request Autocomplete Operators
exist_error_operator3: boolean; //Third Request
general_error_op: string=''; //Third Request
message_operator3: string=''; //Third Request

field_locator4: string=''; //Fourth Request Autocomplete Locators
exist_error_locator4: boolean; //Fourth Request
general_error_loc : string=''; //Fourth Request
message_locator4: string=''; //Fourth Request

general_error_save: string=''; //Fifth Request Save All
field_save: string=''; //Fifth Request Save All
exist_error_save: boolean; //Fifth Request Save All
message_save: string=''; //Fifth Request Save All
  
constructor(public http: Http, public modal: Modal, viewContainer: ViewContainerRef, public _loc: Location, private ngZone: NgZone,
            myElement: ElementRef, public load: LoadingGif, public _properties: DataProperties,  public _filters: filter, public _rol: RolloverAutocompletes, 
            public loc: RecordLocator, public editpass: EditPassenger, public _titleService: TitleService) {

  modal.defaultViewContainer = viewContainer; //Modal Agency
  this.elementRef = myElement; //Autocomplete
  this.load_agency_data(); //Call request function(agency_name and record_locator)

  //ReSize event
    window.onresize = (e) => {
        ngZone.run(() => {
            this.get_size(); 
        });
    };

} //Close constructor
  
//////////////////////////////////////////////////////////
/// Method for alocate div container of Booking Detail ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width_book = false;
  }else if(viewport_width > 1200) {
    this.view_port_width_book = true;
  }
}

/////////////////////////////////////
/// First Request data open Modal ///
load_agency_data() { 
  let get_success;
  let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/agency/get_agency'; 
  let body=JSON.stringify({record_locator_file: this._properties.record_locator_saved});
  console.log(body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            get_success = response.json().get_success;
            console.log('RESPONSE AGENCY DATA: ' + JSON.stringify(response.json()));
            this.general_error1 = response.json().error_data.general_error;
            if(get_success == true){
              this.agencyname = response.json().agency_name;
              this.recordlocator = response.json().record_locator;
              this.agencyCode = response.json().agency_code;
              this.hide_tooltip_agency(); 
            }else { 
              //Show generic error in HTML with ngIf in general_error1
            }        
          }, error => {
        }
      ); 
  }

/////////////////////////////////////////////////////////////////////////////////////////////
/// Second Request data field Agency(Autocomplete) ///
get_list_agencies(letter) {
  this.hide_message_operator();
  this.list_of_agencies = []; //Clean array
  this.list_of_codes_agency = []; //Clean array
  let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/agency/get_agencies';
  let body=JSON.stringify({agency_name: letter});
  console.log('BODY: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => { 
            console.log('JSON: ' + JSON.stringify(response.json()));
            this.exist_error_agency2 = response.json().error_data.exist_error;
            if(this.exist_error_agency2 == true){
              this.field_agency2 = response.json().error_data.error_field_list[0].field;
              this.message_agencies2 = response.json().error_data.error_field_list[0].message;
              if(this.field_agency2 == 'agency'){
                this.hide_show_tooltip_list_agencies();
                //jQuery('#tool-error-agency').append(this.message_agencies2);
                jQuery('.tool-container-agency').show();
              }
            }else {
              this.hide_tooltip_agency();
              for(var i=0; i < response.json().agencies.length; i++) {
                this.list_of_agencies[i] = response.json().agencies[i].name;
                this.list_of_codes_agency[i] = response.json().agencies[i].code;
                //Filter list Autocomplete Agency field   
                this.filteredListAgency = this.list_of_agencies.filter(function(el){
                  return el.toLowerCase().indexOf(this.agencyname.toLowerCase()) > -1;
                }.bind(this));
              } 
            }           
          }, error => {                     
        }
      );
  }

////////////////////////////////////////////////////
/// Implementation Autocomplete for field Agency /// 
filter_agency_name() {
  if (this.agencyname !== ""){ 
      var letter = this.agencyname; //Store letter
      this.get_list_agencies(letter); //Call request function
      jQuery('#agency-name').removeClass('border-pass');
      jQuery('.tool-container-empty-agencies, .tool-container-agency, .tool-container-operator').hide();
  }else{
    this.filteredListAgency = [];
  }
}

select(item, code){
  jQuery('.generic-error-op').hide();
  this.agencyname = item;
  this.agencyCode = code;
  this.filteredListAgency = [];
  this.operatorName = ""; //Clean field Operator
}

handleClick(event){
   var clickedComponent = event.target;
   var inside = false;
   do {
       if (clickedComponent === this.elementRef.nativeElement) {
           inside = true;
       }
      clickedComponent = clickedComponent.parentNode;
   } while (clickedComponent);
    if(!inside){
        this.filteredListAgency = [];
        this.filteredListOperator = [];
        this.filteredListLoc = [];
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/// Third Request data field Operator(Autocomplete) ///
get_list_operators(letter) {
  if(this.agencyname == ''){
    this.agencyCode = '';
  }
  this.list_of_operators = []; //Clean array
  this.list_of_codes = []; //Clean array
  this.list_of_operators_first = []; //Clean array
  this.list_of_operators_last = []; //Clean array
  let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/agency/get_operators_autocomplete';
  let body=JSON.stringify({operator_name: letter, agency_code: this.agencyCode});
  console.log('Body operator: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {                
            console.log('RESPONSE-operators: ' + JSON.stringify(response.json())); //Borrar
            this.operatorCount = response.json().operators_count;
            console.log('COUNT OPERATOR: ' + JSON.stringify(this.operatorCount));
            this.general_error_op = response.json().error_data.general_error;
            this.exist_error_operator3 = response.json().error_data.exist_error;
            if(this.general_error_op != ''){
              //Show generic error in HTML with ngIf
              jQuery('.tool-container-info').hide();
              jQuery('.generic-error-op').show();
            } else if(this.operatorCount == 0 && this.exist_error_operator3 == true){
              this.field_operator3 = response.json().error_data.error_field_list[0].field;
              this.message_operator3 = response.json().error_data.error_field_list[0].message;
               if(this.field_operator3 == 'operator'){
                jQuery('#operator-name').attr("title", this.message_operator3);
                this.show_tooltip_list_operators();
               } else if(this.field_operator3 == 'agency'){
                this.hide_show_tooltip_list_agencies();
                //jQuery('#tool-error-agency').append(this.message_operator3); Ver de borrar
                jQuery('.tool-container-operator').show();  
              }
            } else {
              this.hide_message_operator();
              for(var i=0; i < response.json().operators.length; i++) {
                this.list_of_operators[i] = response.json().operators[i];
                this.list_of_codes[i] = response.json().operators[i].code;
                this.list_of_operators_first[i] = response.json().operators[i].name_first;
                this.list_of_operators_last[i] = response.json().operators[i].name_last;
              }
              //Filter list Autocomplete Operator field
              this.filteredListOperator = this.list_of_operators_last.filter(function(el){
                return el.toLowerCase().indexOf(this.operatorName.toLowerCase()) > -1;
              }.bind(this));
              this.filteredListOperator = this.list_of_operators_last;
              console.log(this.filteredListOperator);
            }     
          }, error => {
        }
      );
  }

//////////////////////////////////////////////////////
/// Implementation Autocomplete for field Operator ///
filter_operator() {
  jQuery('.tool-container-info').hide();
  if (this.operatorName !== ""){ 
      var letter = this.operatorName; //Store letter
      this.get_list_operators(letter); //Call request function
      jQuery('#operator-name').removeClass('border-pass');
      jQuery('.tool-container-operator, .tool-container-agency').hide();
  }else{
    this.filteredListOperator = [];
  }
}
 
select_operator(itemName, codeOp, lastName){
    jQuery('.generic-error-op').hide();
    this.operatorName = itemName + ' ' +lastName;
    this.operatorLastName = lastName;
    this.operatorCode = codeOp;
    this.filteredListOperator = [];
}

/////////////////////////////////////////////////////////////////////////////////////////////
/// Fourth Request data field Locator(Autocomplete) ///
get_list_locators(letterOrNumber) {
  if(this.agencyname == ''){
    this.agencyCode = '';
  }
  this.hide_messages_list_locators();
  let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/agency/get_locators_autocomplete';
  let body=JSON.stringify({ locator_name: letterOrNumber, agency_code: this.agencyCode });
  console.log('LO QUE TE ENVÍO:' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });

      this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            console.log('JSON: ' + JSON.stringify(response.json()));
            this.list_of_locators = response.json().record_locators;
            this.locatorCount = response.json().locators_count;
            this.general_error_loc = response.json().error_data.general_error;
            this.exist_error_locator4 = response.json().error_data.exist_error;
            if(this.general_error_loc != ''){
              //Show generic error in HTML with ngIf in general_error_loc
              jQuery('.tool-container-info').hide();
              jQuery('.generic-error-op').show();
            } else if(this.exist_error_locator4 == true){
              this.field_locator4 = response.json().error_data.error_field_list[0].field;
              this.message_locator4 = response.json().error_data.error_field_list[0].message;
              jQuery('.tool-container-info').hide();
              if(this.field_locator4 == 'locator'){
                this.show_tooltip_list_locators();
                jQuery('#tool-error-locator').empty(); //Clean div message Locator
                jQuery('#tool-error-locator').append(this.message_locator4);
                jQuery('.tool-container-locator').show();
                this.filteredListLoc = []; //Clean Array list to stop show list
              } else if(this.field_locator4 == 'agency'){
                this.hide_show_tooltip_list_agencies();
                jQuery('#tool-error-agency').empty(); //Clean div message Agency
                //jQuery('#tool-error-agency').append(this.message_locator4);
                jQuery('.tool-container-locator').show();
              }
            }else {
              this.hide_tooltip_list_locators();
              //Filter list Autocomplete Locator field
              this.filteredListLoc = this.list_of_locators.filter(function(el){
                return el.toLowerCase().indexOf(this._properties.record_locator_saved.toLowerCase()) > -1;
              }.bind(this));
              console.log('filtered list de locator' + this.filteredListLoc);
            }        
          }, error => {
        }
      );
  }

/////////////////////////////////////////////////////
/// Implementation Autocomplete for field Locator ///
filter_locator() {
  if (this._properties.record_locator_saved !== ""){
      var letterOrNumber = this._properties.record_locator_saved; //Store Letter or Number
      this.get_list_locators(letterOrNumber); //Call request function
      jQuery('#exist-locator2').removeClass('border-pass');
      jQuery('.tool-container-locator').hide();
  }else{
    this.filteredListLoc = [];
  }
}
 
select_locator(itemLoc){
    this._properties.record_locator_saved = itemLoc; 
    this.filteredListLoc = [];
}

////////////////////////////////////////////////////////////////////////////////////
/// Fifth Request Save data ///
save_all_data(send_mail, e) {
  e.stopPropagation();
  this.hide_tooltips_save_all();
  if (this.agencyname == ""){ 
      this.validate_agencies();
  }else{
  let updated;
  let new_locator_generated;
  let url = myGlobals.host+'/api/admin/booking_workspace/file_detail/edit/agency/save';
  let body=JSON.stringify({ record_locator_file: this.recordlocator, agency_code: this.agencyCode, record_locator_new: this._properties.record_locator_saved, operator_code: this.operatorCode, is_new_locator: this.is_new_locator, send_mail: send_mail });
  console.log('BODY-SAVE-ALL: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
  jQuery('.load-agency').fadeIn(); //Show Loading gif Modal Agencies 
  this.http.post( url, body, { headers: headers, withCredentials:true})
    .subscribe(
      response => { 
        console.log('JSON55: ' + JSON.stringify(response.json()));
        updated = response.json().is_updated;
        if(updated == true){
          if(this.is_new_locator == true){
            new_locator_generated = response.json().new_locator_generated;
          } else if(this.is_new_locator == false){ 
             if(this._properties.record_locator_saved==''){ //In case of empty Locator put default locator
              new_locator_generated = this.recordlocator;
             } else{ //New Locator added manually
              new_locator_generated = this._properties.record_locator_saved;
             }
          }
          this._properties.get_file_detail(new_locator_generated);        
          console.log('Respuesta de Save all: '+ JSON.stringify(updated));
          jQuery('.load-agency').fadeOut(); //Hide Loading gif Modal Agencies 
          var get_url = this._filters.create_url(); 
          this._loc.go('/app/bworkspace/filedetail;record_locator='+new_locator_generated+';'+ get_url);
          window.location.reload();
          this.state_normal_field();
          this.remove_modal_agency();              
        }else {
          jQuery('.load-agency').fadeOut(); //Hide loading gif
          this.general_error_save = response.json().error_data.general_error;         
          this.exist_error_save = response.json().error_data.exist_error;   
          if(this.general_error_save != ''){
              //Show generic error in HTML with ngIf in general_error_save
          } else if (this.general_error_save == ''){
              this.field_save = response.json().error_data.error_field_list[0].field;
              this.message_save = response.json().error_data.error_field_list[0].message;
               if(this.field_save == 'locator'){
                jQuery('#exist-locator2').addClass('border-loc');
                jQuery('.tool-container-save').show();
              }   
            }
          }             
        }, error => {
      }
    );
  }
}

////////////////////////////////////
/// Styles Validate Agency field ///
validate_agencies(){
    jQuery('.tool-container-empty-agencies').show();
    jQuery('#tool-error-empty-agencies').tooltip('toggle');
    jQuery('#agency-name').addClass('border-pass');
    jQuery('.tool-container-agency').hide(); 
    jQuery('#check4, #check-mail4').removeAttr("data-dismiss");
    jQuery('#check4, #check-mail4').removeAttr("aria-label");            
}

state_normal_field(){
  jQuery('#check4, #check-mail4').attr("data-dismiss", "modal");
  jQuery('#check4, #check-mail4').attr("aria-label", "Close");
  jQuery('#agency-name').removeClass('border-pass');
  jQuery('.tool-container-empty-agencies').hide();
  jQuery('.tool-container-agency').show();   
}

//////////////////////////////////////////////////
/// Hide Tooltip and class CSS to Agency field ///
hide_tooltip_agency(){
  jQuery('#agency-name').removeClass('border-pass');
  jQuery('#agency-name').tooltip('hide'); 
}

/////////////////////////////////////////////////////////////////////////
/// Hide/Show Tooltips and classes CSS to Agency field (Autocomplete) ///
hide_show_tooltip_list_agencies(){
  jQuery('#agency-name').tooltip('show');
  jQuery('#agency-name').addClass('border-pass');
  jQuery('.tool-container-info-loc, .generic-error-op').hide();
  jQuery('#disabled_locator').prop('checked', false); //Disabled radio button Generate a New Locator
  //jQuery('.tool-container-agency').show();    
}

///////////////////////////////////////////////////////////////////
/// Show Tooltip and class CSS to Operator field (Autocomplete) ///
show_tooltip_list_operators(){
  jQuery('#operator-name').addClass('border-pass');
  jQuery('.tool-container-operator').show(); 
}

////////////////////////////////////////////
/// Hide error message to field Operator ///
hide_message_operator(){
  jQuery('#operator-name').removeClass('border-pass');
  jQuery('#operator-name').tooltip('hide'); 
}

//////////////////////////////////////////////////////////////////
/// Hide Tooltip and class CSS to Locator field (Autocomplete) ///
hide_messages_list_locators(){
  jQuery('.tool-container-empty-agencies').hide();
  jQuery('#agency-name').removeClass('border-pass');
  this.general_error_save = ""; //Clean generic message Save All
}

//////////////////////////////////////////////////////////////////
/// Show Tooltip and class CSS to Locator field (Autocomplete) ///
show_tooltip_list_locators(){
  //jQuery('#exist-locator2').tooltip('show');
  jQuery('#exist-locator2').addClass('border-loc');
}

//////////////////////////////////////////////////////////////////
/// Hide Tooltip and class CSS to Locator field (Autocomplete) ///
hide_tooltip_list_locators(){
  jQuery('#exist-locator2').removeClass('border-loc');
  jQuery('#exist-locator2').tooltip('hide'); 
}

///////////////////////////////////////////
/// Radio Button "Generate New Locator" ///
disabled_locator(e){ //Button radio "Generate a New Locator"
  e.stopPropagation();
  this.disabled_loc = true;
  jQuery('#exist-locator2').addClass('disabled opacity-loc hide-loc');
  jQuery('#exist-locator2').removeClass('border-loc');
  jQuery('#exist-locator2').tooltip('hide'); 
  jQuery('.tool-container-save, .tool-container-empty-agencies, .tool-container-agency, .generic-error-op').hide();
  jQuery('#agency-name').removeClass('border-pass');
  jQuery('.tool-container-info-loc').fadeIn();
  this.hide_message_operator();
  this.is_new_locator = true;
  console.log('Generate New Locator: '+ this.is_new_locator);
}
enabled_locator(){ //Button radio "Use an Existing Locator"
  this._properties.record_locator_saved = this.recordlocator; //Store default Locator
  this.disabled_loc = false;
  jQuery('#exist-locator2').removeClass('disabled opacity-loc hide-loc border-loc');
  jQuery('.tool-container-info-loc').fadeOut();
  jQuery('#disabled_locator').prop('checked', false); //Disabled radio button Generate a New Locator
  jQuery('#exist-locator2').tooltip('hide'); 
  jQuery('.tool-container-save').hide();
  this.recordlocator =  this._properties.record_locator_saved; //Store backup Locator
  this.is_new_locator = false;
  console.log('Existing Locator: '+ this.is_new_locator);
}

//////////////////////////////////////////////
/// Hide Tooltip and class CSS to SAVE ALL ///
hide_tooltips_save_all(){
  jQuery('#exist-locator2').removeClass('border-loc');
  jQuery('#exist-locator2').tooltip('hide');
  jQuery('.generic-error-op, .tool-container-operator, .tool-container-info-loc').hide();
}

//////////////////////////////////
/// Close Modal with key Scape ///
  ngOnInit(): void {
    jQuery('#enabled_locator').prop('checked', true); //Enabled radio button Generate a New Locator when open modal
    jQuery(document).keyup(function(event){
      if(event.which==27){
       jQuery("modal-backdrop").hide();     
      }
    });

    this.get_size();

    //////////////////////////////////////////////////////////////
    /// Show and hide Tooltip INFO Message to "Operator" field /// 
    jQuery("body").on( "click", function() {
      jQuery('.tool-container-info').hide();
      jQuery('.tool-container-agency, .tool-container-operator, .tool-container-locator').tooltip('hide');
      jQuery('.tool-container-agency, .tool-container-operator, .tool-container-locator, .tool-container-info-loc, .tool-container-empty-agencies, .tool-container-save, .generic-error, .generic-error-op, .generic-error-loc, .generic-error-save').hide();
      jQuery('#agency-name, #operator-name, #exist-locator2').removeClass('border-pass');
      jQuery('#operator-name, #exist-locator2').removeClass('border-loc'); 
    });

    jQuery("#operator-name").on( "click", function(e) {
      e.stopPropagation();
      jQuery('.tool-container-info').show();
      jQuery('.generic-error-op').hide();
      jQuery('.tool-container-operator').hide();
      jQuery('.tool-container-info-loc').hide();
      jQuery('#disabled_locator').prop('checked', false); //Disabled radio button Generate a New Locator
      jQuery('#operator-name').removeClass('border-pass');
    });  
}

/////////////////////////////////
/// Button close Modal Agency ///
remove_modal_agency(){
  this._properties.record_locator_saved = this.recordlocator; //Refresh data for field Record Locator
  jQuery("modal-backdrop").hide();
  jQuery("body").removeClass('modal-open');
  jQuery('.pencil-agency').show();
  jQuery('.tool-container-empty-agencies').hide();
  jQuery('#disabled_locator').prop('checked', false); //Disabled radio button Generate a New Locator
  //Refresh data for field Agency
  this.load_agency_data(); //Show data Agency and Locator
  this.enabled_locator(); //Hide menssage Info to Generate a New Locator
  this.operatorName = ""; //Clean field Operator
  this.general_error1 = ""; //Clean generic message Method load_agency_data()
  this.general_error_op = "";  //Clean generic message Operator
  this.general_error_save = ""; //Clean generic message Save All
  jQuery('#operator-name').removeClass('border-pass');
  jQuery('#operator-name').tooltip('hide'); 
}

///////////////////////////////
/// Rollover automcompletes ///
mouseover_color_text(text){ 
    this._rol.mouseover_color_text(text);
}
    mouseleave_color_text(text){ 
    this._rol.mouseleave_color_text(text);
}

}//Close class agency_modal
