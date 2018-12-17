import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  vehicles = [
    { id: 1, src: 'http://placehold.it/400x300' },
    { id: 2, src: 'http://placehold.it/400x300' },
    { id: 3, src: 'http://placehold.it/400x300' },
    { id: 4, src: 'http://placehold.it/400x300' },
    { id: 5, src: 'http://placehold.it/400x300' },
    { id: 6, src: 'http://placehold.it/400x300' },
    { id: 7, src: 'http://placehold.it/400x300'}
  ];

  viewGallery = true;
  newGallery = false;
  detailGallery = false;

  constructor() { }

  ngOnInit() {
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
    console.log(id_gallery);
  }

  backEvent(event) {
    if (event) {
      this.viewGallery = true;
      this.detailGallery = false;
      this.newGallery = false;
    }
  }

}
