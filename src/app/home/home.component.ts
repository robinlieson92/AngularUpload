import { Component, OnInit } from '@angular/core';
import { FirebaseUserModel } from '../user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  submitted = false;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.route.data.subscribe(routeData => {
      const data = routeData['data'];
      if (data) {
        this.user = data;
      }
    });
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: [this.user.name, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get fuser() { return this.profileForm.controls; }

  saveProfile() {
    this.submitted = true;

    if (this.profileForm.valid) {
      this.userService.updateCurrentUser(this.profileForm.value)
        .then(res => {
          window.location.reload();
        }, err => console.log(err));
    }
  }

  logout() {
    this.authService.doLogout()
      .then((res) => {
        window.location.reload();
      }, (error) => {
        console.log('Logout error', error);
      });
  }

}
