import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../../app');
import {LoadingGif} from '../../../bworkspace/filedetail/loading_gif.service';
import {DataPropertiesListAgencies} from '../../list-agencies/data_properties.service';
import {Agencies} from '../../list-agencies/agencies';

declare var jQuery: any;
declare var $: any;

/////////////////////////
/// Plugin Pagination ///

@Component({
    selector: 'my-pagination-list-agencies',
    template: require('./pagination.html'),
    directives: [],
    styles: [require('./pagination.scss')],
    providers: []
})

export class myPaginationListAgencies{

    alias = '_map_list_agencies'; //Set alias name of service request(data_properties.service.ts)

    constructor(public http:Http, public load: LoadingGif, public _map_list_agencies: DataPropertiesListAgencies) {}

    ////////////////////////////
    /// MY PLUGIN PAGINATION ///
    pagination_mappings(event_type){
        console.log('limit: ' + this[this.alias].limit);
        console.log('limit_per_pages: ' + this[this.alias].limit_per_pages);
        switch(event_type) {
            //////////////////////////////////////////////////////////////////
            case 'search':
                this[this.alias].array_pages.length = 0; //Empty array
                if(this[this.alias].limit>this[this.alias].limit_per_pages){ //If more than 7 pages show next button.
                    jQuery('.points').show();
                    this[this.alias].blocker_next = false; 
                    for(var i=1;i<=this[this.alias].limit_per_pages;i++){
                        this[this.alias].array_pages.push(i);       
                    }
                 } else if (this[this.alias].limit<=this[this.alias].limit_per_pages){ 
                    //If less than 7 pages show next button.
                    jQuery('.points').hide();
                    this[this.alias].blocker_next = true; 
                    for(var i=1;i<=this[this.alias].limit;i++){
                        this[this.alias].array_pages.push(i);             
                    }
            } //Close if
            break;
            //////////////////////////////////////////////////////////////////
            case 'select':
                if(this[this.alias].current_page>this[this.alias].limit_per_pages){ //If current page is higher than 7 show prev button.                  
                    // prev blocker false
                }else {                
                    // prev blocker true
                }
            break;
            ////////////////////////////////////////////////////////////////
            case 'next':
                this[this.alias].array_pages.length = 0; //Empty array 
                if(this[this.alias].numbers_of_pages>this[this.alias].last_page){ //If more than 7 pages show next button.              
                    this[this.alias].blocker_next = false;
                    jQuery('.points').show();
                    for(var m = this[this.alias].firstof_page; m<=this[this.alias].last_page; m++){
                        this[this.alias].array_pages.push(m);
                    }
                  }else { //If at the end remove Next    
                    jQuery('.points').hide();
                    this[this.alias].blocker_next = true;
  
                    for(var x=this[this.alias].firstof_page; x<=this[this.alias].numbers_of_pages; x++){
                        this[this.alias].array_pages.push(x);
                    }
                }
            break;
            ////////////////////////////////////////////////////////////////
            case 'prev':
                    this[this.alias].array_pages.length = 0; //Empty array 
                    if(this[this.alias].firstof_page>this[this.alias].limit_per_pages){ //If more than 7 pages show prev button.                
                        this[this.alias].blocker_next = false;
                        jQuery('.points').show();
                        for(var p=this[this.alias].firstof_page; p<=this[this.alias].last_page; p++){
                            this[this.alias].array_pages.push(p);
                        }
                    }else { //If at the begin remove Prev              
                        this[this.alias].blocker_next = false;
                        jQuery('.points').show();
                        for(var c=this[this.alias].firstof_page; c<=this[this.alias].last_page; c++){
                            this[this.alias].array_pages.push(c);
                        }
                    } 
            break;
            } //Close switch 
        
        console.log('First of page: ' + this[this.alias].firstof_page);
        console.log('Bloqueador de siguiente: ' + this[this.alias].blocker_next);
        console.log('total de items: ' + this[this.alias].total_page);
        console.log('array de paginas: ' + this[this.alias].array_pages);
    }

    ///////////////////////////////
    /// BUTTON EVENT PAGINATION ///
    select(number_of_page_selected){
        var letter = this[this.alias].search_map_chains; //Store letter
        var selected_page = number_of_page_selected;

         console.log('letter: ' + letter);
         console.log('selected_page: ' + selected_page);

        this[this.alias].get_list_agencies('select', letter, selected_page).map(json_response => this.pagination_mappings(json_response)).subscribe();
    }

    next_page_map(){
        if(this[this.alias].blocker_next == false){  
            this[this.alias].next_pages_u = this[this.alias].limit_per_pages + 1; //Current page from 8
            this[this.alias].firstof_page = this[this.alias].firstof_page + this[this.alias].limit_per_pages; //1 + 7
            this[this.alias].last_page = this[this.alias].firstof_page + this[this.alias].limit_per_pages - 1; //8+7-1        
            this[this.alias].current_page = this[this.alias].firstof_page; //Current page
            var letter = this[this.alias].search_map_chains; //Store letter
            console.log('primera despues de las 7: ' + this[this.alias].next_pages_u);
            console.log('primera de las 7 + 7: ' + this[this.alias].firstof_page);
            console.log('ultima pagina de las 7: ' + this[this.alias].last_page);
            console.log('letter: ' + letter);
            console.log('event type: ' + 'next');
           

            
            console.log('Número de página actual: ' + this[this.alias].current_page);
            this[this.alias].get_list_agencies('next', letter,  this[this.alias].current_page).map(json_response => this.pagination_mappings(json_response)).subscribe(); //Call request function 
         } 
    }

    prev_page_map(){
        if(this[this.alias].firstof_page > 1){
            this[this.alias].next_pages_u = this[this.alias].limit_per_pages + 1; //Current page from 8
            this[this.alias].firstof_page = this[this.alias].firstof_page - this[this.alias].limit_per_pages; //8-7
            this[this.alias].last_page = this[this.alias].firstof_page + this[this.alias].limit_per_pages - 1; //8+7-1
            this[this.alias].current_page = this[this.alias].firstof_page; //Current page
            var letter = this[this.alias].search_map_chains; //Store letter
            console.log('letter: ' + letter);
            console.log('event type: ' + 'prev');
            console.log('Número de página actual: ' + this[this.alias].current_page);

            this[this.alias].get_list_agencies('prev', letter, this[this.alias].current_page).map(json_response => this.pagination_mappings(json_response)).subscribe(); //Call request function 
        }
    }

    /////////////////////////////////////////
    /// Add Class "Disabled" Prev Button ///
    getClassesButtonPrev(){
        let cssClasses;
        if(this[this.alias].firstof_page > 1){
            cssClasses = {
                'disabled': false     
	        }	
        } else if(this[this.alias].firstof_page < 2) {  
            cssClasses = {
                'disabled': true               
	        }	
        }
        return cssClasses;
    } //Close getClassesButtonPrev

}//Close Class myPagination