import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from '../../firebase.service';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-new-gallery',
  templateUrl: './new-gallery.component.html',
  styleUrls: ['./new-gallery.component.scss']
})
export class NewGalleryComponent implements OnInit {
  @Output() back: EventEmitter<boolean> = new EventEmitter<boolean>();

  uploadForm: FormGroup;
  successMessage: string;
  errorMessage: string;
  submitted = false;
  picture_upload: File;
  video_upload: File;
  audio_upload: File;
  picture_path: Observable<string>;
  video_path: Observable<string>;
  audio_path: Observable<string>;
  picture_url: string;
  video_url: string;
  audio_url: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private firebaseStore: AngularFirestore,
    private firebaseStorage: AngularFireStorage,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      vehicle_number: ['', Validators.required],
      picture: ['', Validators.required],
      video: ['', Validators.required],
      audio: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get fup() { return this.uploadForm.controls; }

  goBack() {
    this.back.emit(true);
  }

  uploadEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.picture_upload = fileInput.target.files[0];
    } else {
      this.picture_upload = null;
    }
  }

  uploadVideoEvent(videoInput: any) {
    if (videoInput.target.files && videoInput.target.files[0]) {
      this.video_upload = videoInput.target.files[0];
      console.log(this.video_upload);
    } else {
      this.video_upload = null;
    }
  }

  uploadAudioEvent(audioInput: any) {
    if (audioInput.target.files && audioInput.target.files[0]) {
      this.audio_upload = audioInput.target.files[0];
      console.log(this.audio_upload);
    } else {
      this.audio_upload = null;
    }
  }

  uploadGallery() {
    this.submitted = true;

    if (this.uploadForm.valid) {
      if (this.video_upload) {
        const videoPath = 'video_test/' + this.video_upload.name;
        const videoRef = this.firebaseStorage.ref(videoPath);
        const taskVideoUpload = this.firebaseStorage.upload(videoPath, this.video_upload);

        taskVideoUpload.snapshotChanges().pipe(
          finalize(() => {
            this.video_path = videoRef.getDownloadURL();

            this.video_path.subscribe(dataVideo => {

              if (this.audio_upload) {
                const audioPath = 'audio_test/' + this.audio_upload.name;
                const audioRef = this.firebaseStorage.ref(audioPath);
                const taskAudioUpload = this.firebaseStorage.upload(audioPath, this.audio_upload);

                taskAudioUpload.snapshotChanges().pipe(
                  finalize(() => {
                    this.audio_path = audioRef.getDownloadURL();

                    this.audio_path.subscribe(dataAudio => {
                      if (this.picture_upload) {
                        const filePath = 'images_test/' + this.picture_upload.name;
                        const fileRef = this.firebaseStorage.ref(filePath);
                        const task = this.firebaseStorage.upload(filePath, this.picture_upload);

                        task.snapshotChanges().pipe(
                          finalize(() => {
                            this.picture_path = fileRef.getDownloadURL();

                            this.picture_path.subscribe(data => {
                              const dataUpload = this.uploadForm.value;
                              dataUpload.picture = data;
                              dataUpload.video = dataVideo;
                              dataUpload.audio = dataAudio;
                              this.firebaseService.createGallery(dataUpload)
                                .then(res => {
                                  this.successMessage = 'Your gallery has been created';
                                  this.errorMessage = '';
                                  setTimeout(() => {
                                    this.back.emit(true);
                                  }, 2000);
                                }, err => {
                                  console.log(err);
                                  this.successMessage = '';
                                  this.errorMessage = err.message;
                                });
                            });
                          })
                        )
                          .subscribe();
                      } else {
                        this.submitted = false;
                        this.successMessage = '';
                        this.errorMessage = 'Picture is required!';
                      }
                    });
                  })
                ).subscribe();
              }
            });
          })
        ).subscribe();
      }
    }
  }

}
