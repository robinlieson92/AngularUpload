import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public fireGallery: AngularFirestore) { }

  getDetailGallery(galleryId) {
    return this.fireGallery.collection('gallery').doc(galleryId).snapshotChanges();
  }

  getGalleries() {
    return this.fireGallery.collection('gallery').snapshotChanges().pipe(
      map(actions => {
        const dataObject = actions.map(a => {
          return Object.assign({ 'id': a.payload.doc.id}, a.payload.doc.data());
        });
        return { data: dataObject };
      })
    );
  }

  createGallery(form) {
    return this.fireGallery.collection('gallery').add({
      brand: form.brand,
      model: form.model,
      vehicle_number: form.vehicle_number,
      image: form.picture
    });
  }
}
