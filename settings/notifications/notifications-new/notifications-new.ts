import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , ViewChild , trigger, transition, style, animate } from '@angular/core';
import { Widget } from '../../../core/widget/widget';
import { RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import { Observable } from 'rxjs/Observable';
import { NKDatetime } from 'ng2-datetime/ng2-datetime'; //Datepicker
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { NgClass } from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import { Core } from '../../../core/core';
import { Location } from '@angular/common';
import myGlobals = require('../../../../app');
import { LoadingGif } from '../../../bworkspace/filedetail/loading_gif.service';
//import { DataPropertiesNotifications } from './data_properties.service';
import { TitleService } from '../../../core/navbar/titles.service';
import { Subscription } from "rxjs";



// Pagination
import { myPagination } from '../../pagination-mappings/pagination.subcomponent';
import { DataPagination } from '../../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

//////////////////////////
/// External Providers ///
@Component({
  selector: '[notifications-new]',
  template: require('./notifications-new.html'),
  styles: [require('./notifications-new.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget],[myPagination]],
  providers: [MODAL_P, Modal, DataPagination] 
})

export class NotificationsNew {

    //Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox

    //Icons Enabled/Disabled Table External Providers
    show_icons_not = false;
    disabled_loc = false; //It's enabled
    selected_c = [];

    //Control width of screens
    view_port_width_not = true;

    showPagination : boolean = true;
    observ: Observable<string> = new Observable<string>(); //Observable source
    myUrl : string;
    messageOpacity  = 1;
    @ViewChild('pagination') myPag;


    constructor(
    public _data_pagination: DataPagination,
    public http: Http,
    public params: RouteParams,
    public router: Router, 
    public _titleService: TitleService,
    public _pag: myPagination,
    private ngZone: NgZone,
    public location : Location , 
    public modal: Modal,
    public load: LoadingGif,
    viewContainer: ViewContainerRef) {
    modal.defaultViewContainer = viewContainer; //Modal 

        //Store imported Title in local title
        this.title_page = _titleService.title_page;
        this.changeMyTitle(); //Update Title

        //ReSize event
        window.onresize = (e) => {
            ngZone.run(() => {
                this.get_size(); 
            });
        };
    } //Close constructor

    changeMyTitle() {
        this._titleService.change('Security / Notifications');
        console.log('User Title: ' + this._titleService.title_page);
    }

ngOnInit() { 


    /*if ( this.location.path() == '/app/settings/notifications') {
        this.restore_search();
    }*/

    if (this.location.path().indexOf(";") != -1 ) {
        this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
    } else {
        this.myUrl = this.location.path();
    }



    this.get_size();


    /*if ( this.params.get('cp') ) {
        var letter = this._service.search_ext_provider; //Store letter
        setTimeout(()=>{
            this._service.get_external_providers(letter,{ page : this.params.get('cp') })
            .map(data => 
            {    
                if ( data.numbers_of_pages > 1 ) {
                   this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
                } else {
                   this.showPagination = false;
                }
             })
                .subscribe();
        });
    } else {
        this.search_ext_providers();
    }

    //SEARCHBOX
    const searchBox = document.getElementById('searchBox');
    const searchLetters = Observable
      .fromEvent(searchBox, 'keyup');
      //.map(i => i);

    const debouncedInput = searchLetters.debounceTime(650);

    const subscribe = debouncedInput.subscribe(val => {
      this.search_ext_providers();
      setTimeout(()=>{
         this.messageOpacity = 1;
      } , 800);
    });

    //DISSAPEAR ON BACKSPACE
    searchLetters.subscribe((val : any) => {
        if (this._service._data_pagination.total_page == 0 ){
            if (val.which == 8){
                this.messageOpacity = 0;
            }
        }  
    });*/


} //Close NgOnInit
 
//////////////////////////////////////////////////////////////
/// Method for alocate div container of External Providers ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width_not = false;
  } else if(viewport_width > 1200) {
    this.view_port_width_not = true;
  }
}

/*current_page_change(data){
        this._service.get_external_providers(this._service.search_ext_provider, { page: data.selectedPage , type : data.type})
        .map(json_response =>
            this.myPag.pagination_mappings({
                 event : 'select' ,
                 _data_pagination : json_response
            }))
        .subscribe(); 
        this.unselect_all();
        this.location.go(this.myUrl+';cp='+data.selectedPage);
        
    //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

/////////////////////////////////////////////
/// Icons of the table for Ext. Providers ///
mouseover_ext_providers(icons){
  var icon = 'i.' + icons;
  jQuery(icon).tooltip('show');
}
mouseleave_ext_providers(icons){
  var icon = 'i.' + icons;
  jQuery(icon).tooltip('hide');
}*/

////////////////////////////////////////////////////
/// Select All (Checkbox) ///
select_all(){
    $('.check-table-not:checked').attr('checked', true);
    var inputs = jQuery('.check-table-not');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == false){
            $('#checkbox' + i).trigger('click');
        }
    }        
}

////////////////////////////////////////////////////
/// Unselect All Checkboxs ///
unselect_all(){
    var inputs = jQuery('.check-table-not');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

/////////////////////////////////////////////////
/// Select All: Change ckeckbox by icon-minus ///
change_to_minus(){ 
    var inputs = jQuery('.check-table-not');
    var count_true = 0;
        for(var i=0; i<inputs.length; i++){
            var checked = $('#checkbox' + i).is(":checked"); 
            if(checked == true){
              count_true++; //Count checkbox checked
            }
        } 
        if(inputs.length == count_true){//If all inputs are check
            console.log('Estan todos seleccionados');                 
            this.justchange= true;
        } else if(count_true == 0){ //If all inputs are unchecked
            console.log('Estan todos deseleccionados');           
            this.justchange= false;
        } else{ //If some input is unckeched         
            this.justchange = 'minus';
        }
}

/*///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
enabled_disabled_all(){       
    this._service.toggle_status = !this._service.toggle_status; //If true change to false, If false change to true boolean
    var status = !this._service.toggle_status;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-not');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id providers' + this._service.list_id);
    var multiple_id=this._service.list_id;
    this.enabled_disabled_toggles(multiple_id, this._service.list_id, status)
    .map(json_response => 
        console.log('Todos')).subscribe(); //Call request function 
    this.justchange= false;
}

/////////////////////////////////////////////////////////////////////
/// Icons enabled-disables single of each checkboxes of the table ///
enabled_disabled_toogle(id, status){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id= this._service.list_id;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-not');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id providers' + this._service.list_id);
    this.enabled_disabled_toggles(single_id, this._service.list_id, status)
    .map(json_response => 
        console.log('Individual')).subscribe(); //Call request function 
    this.justchange= false;
}

//////////////////////////////////////
/// Request icons enabled-disabled ///  
enabled_disabled_toggles(id, selected_checkboxs, status){   
    let url = myGlobals.host+'/api/admin/settings/external_provider/change_status';
    let body=JSON.stringify({ list_providers_code: id, status: status });
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    var letter = this._service.search_ext_provider; //Store letter
    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map( 
        response => {           
            this._service.get_external_providers(letter,{ page : this._service.current_page })
            .subscribe((json_response) => {
                console.log('Se habilita o inhabilita el checkbox')
            }, (err) => console.error(err),() => 
                this.caught_selected_inputs(selected_checkboxs)); 
                return this._service.list_id; //Send back response to the call of the method to use as event_type variable     
        }, error => {}
    ); 
}*/

////////////////////////////////////////////////////////////////////////////////
/// Verify all selected checkbox who were selected and restore the selection ///
 caught_selected_inputs(id){ 
    setTimeout(function(){
        var inputs = jQuery('.check-table-not');
        var id_content;
        for(var i=0; i<inputs.length; i++){
            id_content = $('#checkbox' + i).val();
            for(var x=0; x<id.length; x++){
                if(id_content == id[x]){
                    $('#checkbox' + i).trigger('click');    
                    console.log('Checkbox número: #checkbox' + i);
                }
            }
        }     
    }, 500)
}//Close caught_selected_inputs

/*//////////////////////////////////////////////////////
/// Implementation for input Search Ext. Providers /// 
search_ext_providers() {
    this._service.current_page=1;
    this._service.firstof_page=1;
    var letter = this._service.search_ext_provider; //Store letter
    this._service.get_external_providers(letter,{ page : 1})
    .map(data => 
    {    
        if ( data.numbers_of_pages > 1 ) {
           this.showPagination = true;
            setTimeout(()=>{
               this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
            }, 500);
        } else {
           this.showPagination = false;
        }
    })
        .subscribe(); //Call to request and call pagintation only after get the response. 
        if (this.location.path().indexOf(";") != -1 ) {
            this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
        } else {
            this.myUrl = this.location.path();
        }

        if ( this.showPagination ) {
            this.location.go(this.myUrl+';cp='+1);
        }

}

//Restore the search once the search is closed (Gonzalo)
restore_search(){
    this._service.search_ext_provider = '';
    var letter = this._service.search_ext_provider; //Store letter
    this.search_ext_providers();
    this.unselect_all();// Unselect all selected checkboxes
}*/

////////////////////////////////////////////////////
/// Icon Edit mouseover Table External Providers ///
mouseover_icon_edit(i){ 
  var icon_edit = '#' + i + 'icon-edit';
  jQuery(icon_edit).addClass('color-edit');
}

mouseleave_icon_edit(){
  jQuery('.fa-pencil').removeClass('color-edit');
}

////////////////////////////////////////////////////////////
/// Show icons Enabled/Disabled table External Providers ///
show_icons_notifications(){
  var inputs = jQuery('.check-table-not');
  var count_true = 0;
      for(var i=0; i<inputs.length; i++){
          var checked = $('#checkbox' + i).is(":checked"); 
          if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icons_not = true;
          }
      } 
      if(inputs.length == count_true){//If all inputs are check
          console.log('Estan todos seleccionados');            
          this.show_icons_not = true;
      } else if(count_true == 0){ //If all inputs are unchecked
          console.log('Estan todos deseleccionados');           
          this.show_icons_not = false;
      }
}

/*
////////////////////////////////////////////////////////////////////////
/// Inline editing Form External Providers and Request Get Data Form /// 
open_form_prov(i, id_ext_prov){
    this._edit_prov.open_form_prov(i, id_ext_prov);
}

///////////////////////////////////////////////////////////////
/// Inline editing Form External Providers and Request SAVE /// 
save_ext_prov(id_ext_prov, status, i){
    this._edit_prov.save_ext_prov(id_ext_prov, status, i);
}

///////////////////////////////////////////////////////////
/// Click Button Cancel/close inline External Providers ///
cancel_edit_ext_prov(i, name, days, legend, leg_hotel, leg_attraction, leg_transfer, leg_ife, leg_air, leg_car, leg_package, leg_cruise, leg_insurance, payable, observations, emergency){ 
  this._edit_prov.cancel_edit_ext_prov(i, name, days, legend, leg_hotel, leg_attraction, leg_transfer, leg_ife, leg_air, leg_car, leg_package, leg_cruise, leg_insurance, payable, observations, emergency);
}

///////////////////////////////////////////////////////////////////////////
/// Method Blur field name and Days to Cancel inline External Providers ///
blur_name(){
    jQuery('.field-name').removeClass('border-prov');
    jQuery('.field-days').removeClass('border-prov');
}
focus_name(i) {
    jQuery('.field-name').removeClass('border-prov');
    this._edit_prov.message_name[i] = '';
}
focus_days(i){
    jQuery('.field-days').removeClass('border-prov');
    this._edit_prov.message_days[i] = '';
}*/

keyDownFunction(event) {
    if(event.keyCode == 13) {
         event.preventDefault();
    }
}

} // Close class Notifications
