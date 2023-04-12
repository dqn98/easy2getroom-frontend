import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentViewModel } from 'src/app/viewModels/commentViewModel';
import { AddCommentViewModel } from 'src/app/viewModels/addCommentViewModel';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  appUrl: string = environment.baseUrl;
  constructor(public http: HttpClient) { }

  getComments(propertyId: number): Observable<CommentViewModel[]> {
    return this.http.get<CommentViewModel[]>(this.appUrl + "Comment/GetComments/" + propertyId);
  }

  addComment(viewModel: AddCommentViewModel): Observable<any> {
    console.log(viewModel);
    return this.http.post(this.appUrl + "Comment/AddComment", viewModel);
  }
}
