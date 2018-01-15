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
import {autocompleteConfig} from './autocomplete_config.service';

declare var jQuery: any;
declare var $: any;

///////////
/// IFE ///
@Component({
  selector: 'all-autocompletes',
  template: require('./autocomplete.html'),
  styles: [require('./autocomplete.scss')],
  //encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, [Widget]],
  providers: [autocompleteConfig]
})

export class allAutocompletes {
    relation_name: any;
    location_data_form: any;
    state_validate: any;
    field_error: any;
    filteredList: any;
    list_of_codes: any;
    list_of_names: any;
    length_of_filteredList: any;
    i_user: any;
    name: any;
    code: any;
    select_code_auto: any;
    is_selected = true; //Verify if user select autocomplete option
    border_active = false;

    //Error messages
    general_error: any; //Autocompletes
    exist_error: any; //Autocompletes
    error_field: any;
    message_error: any;


    constructor(
      public http: Http,
      public params: RouteParams,
      public router: Router,
      public load: LoadingGif, 
      viewContainer: ViewContainerRef,
      public location: Location,
      private ngZone: NgZone,
      public _config: autocompleteConfig
    ) {} //Close constructor

@Input() type;
@Output() changeVal: EventEmitter<any> = new EventEmitter<any>();
@Output() clickOnInput: EventEmitter<any> = new EventEmitter<any>();

ngOnInit(){ 
  this._config.init_configuration(this.type);

  $("#inputAutocomplete").change(()=>{
      //myGlobals.alertTravtion('this');
  });
} //Close ngOnInit

notifyMe(){
    this.remove_autocomplete();
  }

/////////////////////////////////////////////////////////////////////////////////////////////
/// Request data list Field City(Autocomplete) ///
get_list_auto(name, e) {
  
  this.list_of_names = []; //Clean array
  this.list_of_codes = []; //Clean array

  let url = myGlobals.host+ this._config.url;
  let body = JSON.stringify({[this._config.body_key]: name, autocomplete_items_count: this._config.items_count});
  console.log('BODY: ' + body);
  let headers = new Headers({ 'Content-Type': 'application/json' });
      this.http.post(url, body, {headers: headers, withCredentials:true})
        .subscribe(
          response => {
            console.log('RESPUESTA autocomplete: ' + JSON.stringify(response.json()));
            this.name = response.json()[this._config.name];
            this.general_error = response.json().error_data[this._config.general_error];
            this.exist_error = response.json().error_data[this._config.exist_error];
            console.log('Error general: ' + JSON.stringify(this.general_error));
            if(this.exist_error == true){
              this.border_active = true;
              //Show generic error in HTML with ngIf in general_error
              if(response.json().error_data.error_field_list.length > 0){
                var error_list = response.json().error_data.error_field_list;
                for(var x=0; x<error_list.length; x++){
                    this.error_field = response.json().error_data.error_field_list[x].field;
                    this.message_error = response.json().error_data.error_field_list[x].message;
                }
              }
            }

              for(var i=0; i<this.name.length; i++) {
                this.list_of_codes[i] = this.name[i].code;
                this.list_of_names[i] = this.name[i].name;
              }
              //Filter list Autocomplete City field
              console.log('city name: ' + JSON.stringify(this.name));
              this.filteredList = this.list_of_names;
              this.length_of_filteredList = this.list_of_names.length; //Get length of list of city
              console.log('length_of_filteredList: ' + JSON.stringify(this.length_of_filteredList));
              console.log('Verificar array filteredList: ' + JSON.stringify(this.filteredList));              
              console.log('lista de códigos:' + this.list_of_codes);
            //}
          }, error => {}
      );
  }

///////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field City with event click ///
filter_name_click(name, e){
  e.preventDefault();
  this.border_active = false;
  this.state_validate = true; //Clean message Auto Providers
  this.error_field = undefined; //Clean message Auto City
  name = '';
  this.get_list_auto(name, e); //Call request function
  this.clickOnInput.emit('click');
}

///////////////////////////////////////////////////////////////////////
/// Implementation Autocomplete for field Provider with event keyup ///
filter_name(name, e){
  e.preventDefault();
  this.border_active = false;
  this.error_field = undefined; //Clean message Auto City
  console.log('Se ejecutó el evento keyup con la letra: ' + name);
  //Validation for field Provider(IFE)
  var validate_auto = /[A-Za-z\s]/;
  if(!validate_auto.test(this.relation_name)){ 
    this.state_validate = false;
    this.border_active = true;
    if(this.relation_name == ''){
      this.border_active = false;
      this.state_validate = true; //Clean message
    }  
  } else {
    this.state_validate = true;
    this.border_active = false;
    this.code = 'error'; //If invalid character broke city code
  }

  var letter_or_number = this.relation_name; //Store letter
  this.get_list_auto(name, e); //Call request function
  this.clickOnInput.emit('click');
}

//////////////////////////////
/// Clean inputs with keyup ///
clean_field(){
  this.remove_autocomplete();
}

//Select city or Provider form user exist
select(item, code){
  this.changeVal.emit({ name: item, code: code });
  this.relation_name = item; 
  this.select_code_auto = code; 
  this.length_of_filteredList = []; 
  this.state_validate = true; 
  this.border_active = false; 
}

remove_message_city(){
  this.field_error = [];
  this.state_validate = true; 
}

/////////////////////////////////////////////////
/// Remove All Autocompletes of Agency Detail ///
remove_autocomplete(){
  this.field_error = []; //Hide general error message First form Agency
  this.filteredList = [];  //First form Agency
  this.length_of_filteredList = []; 
}


} // Close class allAutocompletes
