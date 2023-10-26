import { Component, OnInit } from '@angular/core';
import { POST_LOC_URL, POST_URL } from '../constants/urls';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-uyw',
  templateUrl: './uyw.component.html',
  styleUrls: ['./uyw.component.css'],
})
export class UywComponent implements OnInit {
  imageTitle: string = '';
  images: any[] = [];
  postLocation = POST_LOC_URL;
  selectedImage: File | null = null;
  userName: string | null = '';
  userId!: string;

  constructor(
    private toastrService: ToastrService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('User');
    console.log(userData);
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.name;
      this.userId = user.id;
      console.log(this.userName + this.userId);
    }
    this.http.get<any[]>(POST_URL).subscribe((data) => {
      this.images = data;
    });
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedImage || !this.imageTitle) {
      this.toastrService.error('Please select both image and title');
      return;
    }
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('title', this.imageTitle);

    this.http.post(POST_URL, formData).subscribe(
      (response) => {
        console.log(response);
        this.toastrService.success('Post successfully uploaded');
        this.ngOnInit();
      },
      (error) => {
        console.log(error);
        this.toastrService.error('Failed to upload post');
      }
    );
  }
  deletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return; // User canceled the deletion
    }

    this.http.delete(`${POST_URL}/${postId}`).subscribe(
      () => {
        console.log('Post deleted successfully');
        this.toastrService.success('Post deleted successfully');
        this.ngOnInit();
      },
      (error) => {
        console.error('Error deleting post:', error);
        this.toastrService.error('Failed to delete post');
      }
    );
  }
}
