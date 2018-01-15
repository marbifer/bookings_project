import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {FileDetail} from '../filedetail/filedetail';
import {BookingDetail} from '../bookingdetail/bookingdetail';
import {Bworkspace} from '../../bworkspace/bworkspace';
import {ModalAgency} from './modal_agency';
import {ModalAgencyBooking} from '../bookingdetail/modal_agency';
import {ExternalProviders} from '../../settings/external-providers/external-providers';
import {MappingsCategories} from '../../settings/mappings/all-mappings/mappings';


declare var jQuery: any;
declare var $: any;

/////////////////////////////////////////////////////////////////
/// METHOD LOADING GIF ///

@Injectable()
export class LoadingGif{

constructor(public http:Http) {}

  ///////////////////////////////
  /// Loading Gif File Detail ///
  show_loading_gif(){
    //Show loading gif before get data
    jQuery('.load').fadeIn('slow').html(
      '<div class="loading-file-detail"><img src="./assets/images/loading.gif"></div>');
    jQuery('#wrapper').addClass('opacity');
    jQuery('.ams-container').addClass('opacity-loading');
  }

  hide_loading_gif(){
    //Hide loading gif
    jQuery('.load').fadeOut('slow');
    jQuery('#wrapper').removeClass('opacity');
    jQuery('.ams-container').removeClass('opacity-loading');
  }

  ///////////////////////////////
  /// Loading Gif Booking Detail ///
  show_loading_gif_book(){
    //Show loading gif before get data
    jQuery('.load').fadeIn('slow').html(
      '<div class="loading-file-detail"><img src="./assets/images/loading.gif"></div>');
    jQuery('.container-file-detail').addClass('opacity');
    jQuery('.ams-container').addClass('opacity-loading');
  }

  hide_loading_gif_book(){
    //Hide loading gif
    jQuery('.load').fadeOut('slow');
    jQuery('.container-file-detail').removeClass('opacity');
    jQuery('.ams-container').removeClass('opacity-loading');
  }

  //////////////////////////////
  /// Loading Gif Bworkspace ///
  show_loading_gif_bw(){
    //Show loading gif 
    jQuery('.load').fadeIn('slow').html(
      '<div class="loading"><img src="./assets/images/loading.gif"></div>'); 
    jQuery('.table').addClass('opacity');  
    //jQuery('.table').addClass('opacity-loading');
    jQuery('.ams-container').addClass('opacity-loading');
  }

  hide_loading_gif_bw(){
    //Hide loading gif
    jQuery('.load').fadeOut('slow');
    jQuery('.table').removeClass('opacity');
    //jQuery('.table').removeClass('opacity-loading');
    jQuery('.ams-container').removeClass('opacity-loading');
  }

}