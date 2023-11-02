import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5000/api/comments'; // Base URL for comments

  addComment(postId: string, text: string) {
    const url = `${this.apiUrl}/images/${postId}/comments`;
    const body = { text };
    return this.http.post(url, body);
  }

  deleteComment(commentId: string) {
    const url = `${this.apiUrl}/${commentId}`;
    return this.http.delete(url);
  }

  getCommentsForPost(postId: string) {
    const url = `${this.apiUrl}/images/${postId}/comments`;
    return this.http.get(url);
  }
}
