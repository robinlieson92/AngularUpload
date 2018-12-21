import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-detail-gallery',
  templateUrl: './detail-gallery.component.html',
  styleUrls: ['./detail-gallery.component.scss']
})
export class DetailGalleryComponent implements OnInit {
  @Output() back: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() id: string;

  @ViewChild('video_vehicle') video: ElementRef;

  vehicle: any;
  showVideo = false;

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.showGallery(this.id);
  }

  playVideo() {
    this.showVideo = true;
    const self = this;

    setTimeout(() => {
      this.video.nativeElement.onended = function() {
        self.showVideo = false;
      };
    }, 2000);
  }

  showGallery(id) {
    this.firebaseService.getDetailGallery(id)
    .subscribe(response => {
      console.log(response);
      this.vehicle = response.data;
    }, err => {
      console.log(err);
      alert(err.message);
    });
  }

  goBack() {
    this.back.emit(true);
  }
}
