import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FORM_URL } from '../constants/urls';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      // Create an object to send to the server
      const formData = {
        name: this.contactForm.get('name')!.value,
        email: this.contactForm.get('email')!.value,
        message: this.contactForm.get('message')!.value,
      };

      // Make a POST request to your server
      this.http.post(`${FORM_URL}`, formData).subscribe(
        (response) => {
          console.log('Data saved successfully');
        },
        (error) => {
          console.error('Error:', error);
          // Handle errors here, such as displaying an error message.
        }
      );
    }
  }
}
