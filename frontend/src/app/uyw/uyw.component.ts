import { Component, OnInit } from '@angular/core';
import { POST_LOC_URL, POST_URL } from '../constants/urls';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { CommentsService } from '../services/comments.service';

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
  isCollapsed: boolean = false;
  newComment!: string;
  comments: any[] = [];

  constructor(
    private toastrService: ToastrService,
    private http: HttpClient,
    private userService: UserService,
    private commentService: CommentsService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('User');

    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.name;
      this.userId = user.id;
    }
    this.http.get<any[]>(POST_URL).subscribe((data) => {
      this.images = data;

      for (const post of this.images) {
        this.commentService
          .getCommentsForPost(post._id)
          .subscribe((comments) => {
            post.comments = comments; // Associate comments with the post
          });
      }
    });
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
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

  // comments methods
  createComment(postId: string) {
    if (!this.newComment) {
      this.toastrService.error('Please enter a comment');
      return;
    }

    this.commentService.addComment(postId, this.newComment).subscribe(
      (response) => {
        this.toastrService.success('Comment added successfully');
        this.newComment = '';
        this.ngOnInit(); // Refresh comments after adding a new one
      },
      (error) => {
        console.log(error);
        this.toastrService.error('Failed to add comment');
      }
    );
  }

  deleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return; // User canceled the deletion
    }

    this.commentService.deleteComment(commentId).subscribe(
      () => {
        console.log('Comment deleted successfully');
        this.toastrService.success('Comment deleted successfully');
        this.ngOnInit(); // Refresh comments after deleting one
      },
      (error) => {
        console.error('Error deleting comment:', error);
        this.toastrService.error('Failed to delete comment');
      }
    );
  }
}
