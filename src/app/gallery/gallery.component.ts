import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  vehicles: any[];

  viewGallery = true;
  newGallery = false;
  detailGallery = false;

  id_gallery: string;

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.getGallery();
    this.id_gallery = '';
  }

  getGallery() {
    this.firebaseService.getGalleries()
    .subscribe(response => {
      console.log(response);
      this.vehicles = response.data;
    }, err => {
      console.log(err);
      alert(err.message);
    });
  }

  createGallery() {
    this.newGallery = true;
    this.viewGallery = false;
    this.detailGallery = false;
  }

  showGallery(id_gallery) {
    this.detailGallery = true;
    this.newGallery = false;
    this.viewGallery = false;
    this.id_gallery = id_gallery;
  }

  backEvent(event) {
    if (event) {
      this.viewGallery = true;
      this.detailGallery = false;
      this.newGallery = false;
    }
  }

}
