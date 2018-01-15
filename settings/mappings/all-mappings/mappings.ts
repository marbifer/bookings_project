import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone, ViewChild  , OnDestroy} from '@angular/core';
import {Widget} from '../../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../../services/http-wrapper';
import myGlobals = require('../../../../app');
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../../core/core';
import {Location} from '@angular/common';
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {RolloverAutocompletes} from '../../../customers/rollovers-dropdown.service';
import {DataPropertiesMapCategories} from './data_properties.service';
import {relationShipsMappingsCategories} from '../all-mappings/inlinediting/edit_relationships_map.service'; //Inline Editing Mappings Categories
import {myPagination} from '../../pagination-mappings/pagination.subcomponent';
import {TitleService} from '../../../core/navbar/titles.service';
import {DataPagination} from '../../pagination-mappings/data_pagination.service';
import {pathName} from '../../../core/sidebar/path_name.service'; //Service Unification All mappings (Listados simples)

declare var jQuery: any;
declare var $: any;

////////////////////////////////////////////
/// Unification: All Mappings Categories ///
@Component({
  selector: '[mappings-categories]',
  template: require('./mappings.html'),
  styles: [require('./mappings.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget],[myPagination]],
  providers: [MODAL_P, Modal, DataPagination] 
})

export class MappingsCategories {

    //Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox

    //Icon Delete Table Mappings Categories
    show_icon_map = false;

    //Control width of screens
    view_port_width_map = true;

    mappings_type: string;
    path_name: any; //Name of the Path without underscore

    showPagination: boolean = false;
    routeForNavigation : any;
    myUrl : any;
    messageOpacity  = 1;
    @ViewChild('pagination') myPag;
    preventMultipleSearch :number = 0;
    name_of_item_menuBackup:any;

    constructor(
        public http: Http, 
        public params: RouteParams, 
        public router: Router, 
        public _titleService: TitleService,
        public modal: Modal, 
        public load: LoadingGif, 
        viewContainer: ViewContainerRef, 
        public location: Location, 
        public _path_name: pathName,
        private ngZone: NgZone, 
        public _map_categories_service: DataPropertiesMapCategories, 
        public _rol: RolloverAutocompletes,
        public _data_pagination: DataPagination, 
        public pag: myPagination, 
        public _edit_map: relationShipsMappingsCategories
    ) {

        modal.defaultViewContainer = viewContainer; //Modal

        // this.preventMultipleSearch +=1;
        ////////////////////////////////////////////////////////////
        /// Call ngOnInit again after click on sidebar item menu ///
        this._path_name.reload_component.subscribe((name_of_item_menu) => { 
            // myGlobals.alertTravtion('myGlobals.mappingsControlGeneral: ' + myGlobals.mappingsControlGeneral );
            // if ( myGlobals.mappingsControlGeneral != 1 ) {

                // myGlobals.alertTravtion('this.name_of_item_menuBackup: '+this.name_of_item_menuBackup);
                // myGlobals.alertTravtion('name_of: '+myGlobals.mappingsControl);
                // myGlobals.alertTravtion('name_of_item_menu: '+name_of_item_menu);
                // if ( myGlobals.mappingsControl != undefined && myGlobals.mappingsControl != name_of_item_menu ){
            if ( name_of_item_menu.indexOf("Mappings") >= 0 ) {

                if (name_of_item_menu == 'MappingsAttractionCategories' || name_of_item_menu == 'MappingsAmenities' || name_of_item_menu == 'MappingsChains' || name_of_item_menu == 'MappingsCategories' || name_of_item_menu == 'MappingsMealplans') {
                    if (  myGlobals.mappingsControl != name_of_item_menu ){
                        // myGlobals.alertTravtion('Adentro: ');
                        // myGlobals.mappingsControlGeneral = true;
                        this.ngOnInit();
                        this.showPagination = true;
                    }
                    myGlobals.mappingsControlGeneral = true;
                    // if ( this.name_of_item_menuBackup != undefined && this.name_of_item_menuBackup == name_of_item_menu ){
                    //     // this.name_of_item_menuBackup = name_of_item_menu;
                    //     // this.name_of_item_menuBackup = name_of_item_menu;
                    //       console.log('name_of_item_menu:________________'+name_of_item_menu);
                    //       // console.log("this.preventMultipleSearch: "+this.preventMultipleSearch);
                    //       console.log("this.name_of_item_menuBackup: "+this.name_of_item_menuBackup);

                    // // if (name_of_item_menu == 'MappingsAttractionCategories') {
                    // // }
                    //     if (name_of_item_menu == 'MappingsAttractionCategories' || name_of_item_menu == 'MappingsAmenities' || name_of_item_menu == 'MappingsChains' || name_of_item_menu == 'MappingsCategories' || name_of_item_menu == 'MappingsMealplans') {
                    //     //     if ( this.preventMultipleSearch == 2) {
                    //     //         this.preventMultipleSearch = 0;
                    //     //     } else {
                    //     //               myGlobals.alertTravtion('this');
                    //     //         this.ngOnInit();
                    //     //     }
                    //     //     this.showPagination = true;
                    //         // myGlobals.alertTravtion(this.preventMultipleSearch);
                    //         // myGlobals.alertTravtion(this.preventMultipleSearch);
                    //         // this.preventMultipleSearch +=1;
                            
                    //         // this.ngOnInit();
                    //         // this.showPagination = true;
                    //     }
                    // }
                    ngZone.run(()=>{
                        myGlobals.mappingsControl = name_of_item_menu;
                           // myGlobals.alertTravtion('ANTES DE: '+myGlobals.mappingsControl);
                    });
                }
            } else {
                myGlobals.mappingsControlGeneral = true;
            }
            // }
        }); 


        //ReSize event
        window.onresize = (e) => {
            ngZone.run(() => {
                this.get_size(); 
            });
        }; 
        
    } //Close constructor

    ngOnDestroy(){
        myGlobals.mappingsControlGeneral = false;
        myGlobals.mappingsFromDestroy = true;
    }

    changeMyTitle() {
        this._titleService.change('Mappings / '+this.title_page);
        console.log('User Title: ' + this._titleService.title_page);
    }
    ngOnInit(){
        var mapControl;
        mapControl = String(myGlobals.mappingsControl);
        //Store imported Title in local title
        this.title_page = this._titleService.title_page;
        this.changeMyTitle(); //Update Title
        
        // if (  mapControl.indexOf("Mappings") == -1 ) {
        //     myGlobals.mappingsControlGeneral = true;
        // }
        
        // myGlobals.alertTravtion('mappingsControlGeneral en el ngOnInit: '+ myGlobals.mappingsControlGeneral);
       
       if ( myGlobals.mappingsControlGeneral == true ) {
                  // myGlobals.alertTravtion('acaDESPUES');
            if (this.location.path().indexOf(";") != -1) {
                this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
            } else {
                this.myUrl = this.location.path();
            }

            this.get_size();
            this.justchange = false;
            //////////////////////////////////////
            /// Animation to Search extensible ///
            var s = $('.circle-animate-search input'),
                t = $('.search-circle-lupa input'),
                u = $('.open-search-map'),
                f = $('form'),
                a = $('.after'),
                c = $('.search-circle-lupa'),
                m = $('.text-search p'),
                x = $('.text-search-animate p'),
                z = $('.sidebar');

            s.focus(function(e){
                e.preventDefault();
                if( f.hasClass('open') ) return;
                m.hide();
                c.hide();
                a.show();
                x.show(); 
                s.addClass('search-background');
                f.addClass('in');
                setTimeout(function(){
                    f.addClass('open');
                    f.removeClass('in');
                }, 800);
            });

            t.focus(function(e){
                e.preventDefault();
                if( f.hasClass('open') ) return;
                m.hide();
                c.hide();
                a.show();
                x.show(); 
                s.addClass('search-background');
                f.addClass('in');
                setTimeout(function(){
                    f.addClass('open');
                    f.removeClass('in');
                }, 800);
            });

            u.on('click', function(e){
                e.preventDefault();
                if( f.hasClass('open') ) return;
                m.hide();
                c.hide();
                a.show();
                x.show(); 
                s.addClass('search-background');
                f.addClass('in');
                setTimeout(function(){
                    f.addClass('open');
                    f.removeClass('in');
                }, 800);
            });

            a.on('click', function(e){
                e.preventDefault();
                if( !f.hasClass('open')) return;
                s.val('');
                f.addClass('close');
                f.removeClass('open');
                s.removeClass('search-background');
                m.fadeIn();
                x.fadeOut();
                c.fadeIn(50);
                a.hide(1);
                setTimeout(function(){
                    f.removeClass('close');
                }, 0);
            })

            z.on('click', function(e){
                if( !f.hasClass('open')) return;
                s.val('');
                f.addClass('close');
                f.removeClass('open');
                s.removeClass('search-background');
                m.fadeIn();
                c.fadeIn();
                x.hide();
                a.hide();
                setTimeout(function(){
                    f.removeClass('close');
                }, 0);
            })

            f.submit(function(e){
                e.preventDefault();
                m.html('Search By Category or Provider').addClass('show');
                x.html('Search By Category or Provider').addClass('show');
                f.addClass('explode');
                setTimeout(function(){
                    s.val('');
                    f.removeClass('explode');
                    m.removeClass('show');
                    x.removeClass('show');
                }, 0);
            })

            setTimeout(() => { //Open First setTimeout
                
                if (this.location.path() == '/app/settings/mappings/categories' || this.location.path() == '/app/settings/mappings/categories;cp='+ this.params.get('cp')) { //Comparo en qué URL estoy
                    this._map_categories_service.routeForNavigation = 'MappingsCategories';
                    this.mappings_type = 'hotel_categories'; //Guardo un String de referencia
                    this._edit_map.mappings_type_request = 'hotel_categories'; //Guardo un String de referencia para el servicio de edit
                    this._map_categories_service.mappings_type_request_data = 'hotel_categories'; //Guardo un String de referencia para el servicio del request
                    this._titleService.change('Mappings / Categories'); //Cambio el título del Navbar en función del listado en el que esté 
                    this.path_name = 'Hotel Categories'; //Cambio el texto sin guiones bajos                        
                }
                else if (this.location.path() == '/app/settings/mappings/attraction-categories' || this.location.path() == '/app/settings/mappings/attraction-categories;cp='+this.params.get('cp')) {
                    this._map_categories_service.routeForNavigation = 'MappingsAttractionCategories';
                    this.mappings_type = 'attraction_categories';
                    this._edit_map.mappings_type_request = 'attraction_categories';
                    this._map_categories_service.mappings_type_request_data = 'attraction_categories';
                    this._titleService.change('Mappings / Categories');
                    this.path_name = 'Attraction Categories';
                }
                else if (this.location.path() == '/app/settings/mappings/amenities'  || this.location.path() == '/app/settings/mappings/amenities;cp='+this.params.get('cp')) {
                    this._map_categories_service.routeForNavigation = 'MappingsAmenities';
                    this.mappings_type = 'amenities';
                    this._edit_map.mappings_type_request = 'amenities';
                    this._map_categories_service.mappings_type_request_data = 'amenities';
                    this._titleService.change('Mappings / Amenities');
                    this.path_name = 'Amenities';
                }
                else if (this.location.path() == '/app/settings/mappings/chains' || this.location.path() == '/app/settings/mappings/chains;cp='+this.params.get('cp')) {
                    this._map_categories_service.routeForNavigation = 'MappingsChains';
                    this.mappings_type = 'chains';
                    this._edit_map.mappings_type_request = 'chains';
                    this._map_categories_service.mappings_type_request_data = 'chains';
                    this._titleService.change('Mappings / Chains');
                    this.path_name = 'Chains';
                }
                else if (this.location.path() == '/app/settings/mappings/mealplans' || this.location.path() == '/app/settings/mappings/mealplans;cp='+this.params.get('cp')) {
                    this._map_categories_service.routeForNavigation = 'MappingsMealplan';
                    this.mappings_type = 'mealplans';
                    this._edit_map.mappings_type_request = 'mealplans';
                    this._map_categories_service.mappings_type_request_data = 'mealplans';
                    this._titleService.change('Mappings / Meal plans');
                    this.path_name = 'Mealplans';
                }

            setTimeout(() => { //Open second setTimeout
                //this.restore_search(); 

                if ( this.params.get('cp') ) {
                    var letter = this._map_categories_service.search_map_categories; //Store letter
                    this._map_categories_service.get_mappings_categories(letter,{ page : Number(this.params.get('cp')) })
                    .map(data => {    
                            this.recursive_check_pagination(data);
                        }).subscribe();
                } else {
                    this._map_categories_service.search_map_categories = '';
                    var letter = this._map_categories_service.search_map_categories; //Store letter
                    this.search_map_categories();
                }
              }, 100); //Close second setTimeout  
            }, 100); //Close first setTimeout

            /// Search box ///
            const searchBox = document.getElementById('searchBox');
            const searchLetters = Observable
              .fromEvent(searchBox, 'keyup');

            const debouncedInput = searchLetters.debounceTime(650);
            const subscribe = debouncedInput.subscribe(val => {
              this.search_map_categories();
               setTimeout(()=>{
                 this.messageOpacity = 1;
              } , 800);
            });

            /// DISSAPEAR ON BACKSPACE ///
            searchLetters.subscribe((val : any) => {
                if (this._map_categories_service._data_pagination.total_page == 0 ){
                    if (val.which == 8){
                        this.messageOpacity = 0;
                    }
                }  
            });

       }
              
          // myGlobals.alertTravtion('this.mappings_type: '+this.mappings_type);
          // myGlobals.alertTravtion('this.mappings_type: '+this._map_categories_service.mappings_type_request_data );
          
        // Aid to prevent multiple search and non settings vars //
        if (  myGlobals.mappingsFromDestroy == true ) {
            myGlobals.mappingsControlGeneral = true;
            myGlobals.mappingsFromDestroy = false;
        }

} //Close ngOnInit

current_page_change(data){
        this._map_categories_service.get_mappings_categories(data.letter, { page: data.selectedPage , type: data.type})
        .map(json_response =>{
            this.myPag.pagination_mappings({
                event : 'select' ,
                    _data_pagination : json_response
            })
        }).subscribe(); 

        this.unselect_all_maps();
        this.location.go(this.myUrl+';cp='+data.selectedPage);
      //console.log("current: "+this._map_categories_service.routeForNavigation);
      //this.router.navigate(['/App' , this._map_categories_service.routeForNavigation , { cp : data.selectedPage  }]);
    //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}


recursive_check_pagination(data ){
     this.showPagination = true;
     if ( this.myPag != undefined  ){
        if ( data.numbers_of_pages > 1 ) {
            this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
        } else {
           this.showPagination = false;
        }
    } else {
        setTimeout(()=>{
            this.recursive_check_pagination(data);
        }, 500);
    }
}

///////////////////////////////////////////////////////////////
/// Method for alocate div container of Mappings Categories ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width_map = false;
  } else if(viewport_width > 1200) {
    this.view_port_width_map = true;
  }
}

/////////////////////////////
/// Select All (Checkbox) ///
select_all_maps(){
    $('.check-table-maps:checked').attr('checked', true);
    var inputs = jQuery('.check-table-maps');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == false){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

//////////////////////////////
/// Unselect All Checkboxs ///
unselect_all_maps(){
    var inputs = jQuery('.check-table-maps');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

/////////////////////////////////////////////////
/// Select All: Change ckeckbox by icon-minus ///
change_to_minus_maps(){
    var inputs = jQuery('.check-table-maps');
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

////////////////////////////////
/// Icon Delete of the Title ///
delete_all_mappings(){
    var counter = 0;
    this._map_categories_service.list_id = []; //Clean array
    var list_selected=[];
    var inputs = jQuery('.check-table-maps');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            counter++;
            var id_content = $('#checkbox' + i).val();
            this._map_categories_service.list_id.push(id_content);
            list_selected.push(i);
        }
    }

    var pageForDelete;
    if (inputs.length == counter) {
        if (this._map_categories_service.current_page == 1 ){
            pageForDelete = this._map_categories_service.current_page;
        } else {
            pageForDelete = this._map_categories_service.current_page - 1;
        }
    } else {
        pageForDelete = this._map_categories_service.current_page;
    }

    var multiple_id = this._map_categories_service.list_id;
    this.delete_mappings(multiple_id, list_selected , pageForDelete)
    .map(json_response => 
        console.log('Borrado de múltiples')).subscribe(); //Call request function 
    
    this.location.go(this.myUrl+';cp='+pageForDelete);  
    this.justchange= false;
}

///////////////////////////////////////////////
/// Request icon delete single or multiples ///
delete_mappings(code, list_selected , pageForDelete){
  console.log('Se intenta borrar: ' + code);
    var url;
    if(this.mappings_type=='hotel_categories'){ //Verify which mappings categories it is
        url = myGlobals.host+'/api/admin/mappings/hotel_category/delete'; //Guardo la URL completa del listado correspondiente
    }
    else if(this.mappings_type=='attraction_categories'){
        url = myGlobals.host+'/api/admin/mappings/attraction_category/delete';
    }
    else if(this.mappings_type=='amenities'){
        url = myGlobals.host+'/api/admin/mappings/amenities/delete';
    }
    else if(this.mappings_type=='chains'){
        url = myGlobals.host+'/api/admin/mappings/chains/delete';
    }
    else if(this.mappings_type=='mealplans'){
        url = myGlobals.host+'/api/admin/mappings/mealplans/delete';
    }
       
    let body=JSON.stringify({ list_relationships_code: code });
    console.log('Body: Delete Mappings: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

      return this.http.post( url, body, {headers: headers, withCredentials:true})
      .map( 
          response => {
            this._map_categories_service.get_mappings_categories(this._map_categories_service.search_map_categories, {page: pageForDelete}) //Call request function and subscribe but not call another method after get a response.
             .map(data => {    
                data.current_page = pageForDelete;
                this.recursive_check_pagination(data);
                // if ( data.numbers_of_pages > 1 ) {
                //    this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
                // } else {
                //    this.showPagination = false;
                // }
             }).subscribe((json_response) => {
                console.log('Se eliminan los seleccionados');
            },
               (err) => console.error(err),
                () => this.caught_selected_inputs(code, list_selected)); 
                console.log('Updated: ' + JSON.stringify(response.json()));       
                return this._map_categories_service.list_id; //Send back response to the call of the method to use as event_type variable     
        }, error => {}
      );    
}

////////////////////////////////////////////////////////////////////////////////
/// Verify all selected checkbox who were selected and restore the selection ///
 caught_selected_inputs(id,list_selected){ 
     console.log('Lista de seleccionados: ' + list_selected);
    setTimeout(function(){
        var inputs = jQuery('.check-table-maps');    
        for(var i=0; i<inputs.length; i++){      
            for(var x=0; x<list_selected.length; x++){
                 if(list_selected[x] == i){
                    $('#checkbox' + i).trigger('click');    
                    console.log('Checkbox número: #checkbox' + i);
                }
            }
        }     
    }, 500)
}//Close caught_selected_inputs

///////////////////////////////////////////////////////////
/// Implementation for input Search Mappings Categories /// 
search_map_categories() {
    var setInverval_Variable;
    clearInterval(setInverval_Variable);
    setInverval_Variable = setInterval(this.search_function(), 500);     
}

search_function() {
    this._edit_map.filteredListRelationships = []; //Reset filtered list
    this._edit_map.close_all() //Try to close all opened previous boxes to start a new search
    this._data_pagination.current_page=1;
    this._data_pagination.firstof_page=1;

    var letter = this._map_categories_service.search_map_categories; //Store letter
    this._map_categories_service.get_mappings_categories(letter,{ page : 1}) //Acá agregar propiedad para indicar de que request se trata 
    .map(data => {    
        this.recursive_check_pagination(data);
    }).subscribe(); //Call to request and call pagination only after get the response.

        if (this.location.path().indexOf(";") != -1 ) {
            this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
        } else {
            this.myUrl = this.location.path();
        }
        if (this.showPagination) {
            this.location.go( this.myUrl+';cp='+1);
        }
}

/// Restore the search once the search is closed (Luciano) ///
restore_search(){
    this._map_categories_service.search_map_categories = '';
    var letter = this._map_categories_service.search_map_categories; //Store letter
    //this.search_function();
    this.unselect_all_maps();
}

/// Restore the search once the search is closed (Luciano) ///
restore_searchBox(){
    this._map_categories_service.search_map_categories = '';
    var letter = this._map_categories_service.search_map_categories; //Store letter
    this.search_function();
    this.unselect_all_maps();
}

//////////////////////////////////////////////////
/// Show icon Delete table Mappings Categories ///
show_icon_mappings(){
  var inputs = jQuery('.check-table-maps');
  var count_true = 0;
      for(var i=0; i<inputs.length; i++){
          var checked = $('#checkbox' + i).is(":checked"); 
          if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icon_map = true;
          }
      } 
      if(inputs.length == count_true){//If all inputs are check
          console.log('Estan todos seleccionados');            
          this.show_icon_map = true;
      } else if(count_true == 0){ //If all inputs are unchecked
          console.log('Estan todos deseleccionados');           
          this.show_icon_map = false;
      }
}

////////////////////////////////////////////////////
/// Icon Edit mouseover Table Mapping Categories ///
mouseover_icon_edit(i){ 
  var icon_edit = '#' + i + 'icon-edit';
  jQuery(icon_edit).addClass('color-edit');
}

mouseleave_icon_edit(){
  jQuery('.fa-pencil, .fa-plus').removeClass('color-edit');
}

//////////////////////////////////////////////////////
/// Methods Inline editing for Mappings Categories ///
//////////////////////////////////////////////////////
/// Inline editing: Buttons Save, Cancel ///
rollover_icons_save_cancel(editing){
   this._edit_map.rollover_icons_save_cancel(editing);
}

//////////////////////////////////////////////////
/// Service Rollover Automcomplete or Dropdown ///
mouseover_color_text(text){ 
    this._rol.mouseover_color_text(text);
}
mouseleave_color_text(text){ 
    this._rol.mouseleave_color_text(text);
}

//////////////////////////////////////////////////////
/// Inline editing field relationships to Mappings /// 
edit_relationships(data, pencil, id, buttons, list_map, default_relation, i){
    this._edit_map.edit_relationships(data, pencil, id, buttons, list_map, default_relation, i);
}

///////////////////////////////////////////////
/// Click Icon-cancel/close inline Mappings ///
cancel_edit_relationships(relationship_default){ 
    this._edit_map.cancel_edit_relationships(relationship_default);  
}

/////////////////////////////////////////////////////////////
/// Request Autocomplete inline Mappings with event click ///
filter_category_name_click(relationship_code, i) {
    this._edit_map.filter_category_name_click(relationship_code, i);
}

/////////////////////////////////////////////////////////////
/// Request Autocomplete inline Mappings with event keyup ///
filter_category_name(relationship_code, i) {
    this._edit_map.filter_category_name(relationship_code, i);
}

select(item, code){
  this._edit_map.select(item, code);
}

save_relationships_map(rel_code, prov_code, cod, cod_int, i){
    this._edit_map.save_relationships_map(rel_code, prov_code, cod, i);
}

keyDownFunction(event) {
  if(event.keyCode == 13) {
    event.preventDefault();
  }
}


} // Close class MappingsCategories
