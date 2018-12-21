import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public fireGallery: AngularFirestore) { }

  getDetailGallery(galleryId) {
    return this.fireGallery.collection('gallery_test').doc(galleryId).snapshotChanges().pipe(
      map(result => {
        const data = Object.assign({ 'id': result.payload.id }, result.payload.data());
        return { data };
      })
    );
  }

  getGalleries() {
    return this.fireGallery.collection('gallery_test').snapshotChanges().pipe(
      map(actions => {
        const dataObject = actions.map(a => {
          return Object.assign({ 'id': a.payload.doc.id}, a.payload.doc.data());
        });
        return { data: dataObject };
      })
    );
  }

  createGallery(form) {
    return this.fireGallery.collection('gallery_test').add({
      brand: form.brand,
      model: form.model,
      vehicle_number: form.vehicle_number,
      image: form.picture,
      video: form.video,
      audio: form.audio,
    });
  }
}
