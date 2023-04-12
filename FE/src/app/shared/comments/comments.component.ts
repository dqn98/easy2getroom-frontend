import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
import { CommentViewModel } from 'src/app/viewModels/commentViewModel';
import { AccountService } from 'src/app/services/account.service';
import { RatingViewModel } from 'src/app/viewModels/ratingViewModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CheckRatingViewModel } from 'src/app/viewModels/checkRatingViewModel';
import { AddCommentViewModel } from 'src/app/viewModels/addCommentViewModel';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input('propertyId') propertyId;
  public commentForm: FormGroup;
  public reviews: CommentViewModel[];

  public rating: number;
  public starCount: number = 5;
  public starColorP: StarRatingColor = StarRatingColor.primary;

  constructor(public fb: FormBuilder,
    private snackBar: MatSnackBar,
    public authService: AuthService,
    public commentsService: CommentsService,
    public accountService: AccountService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    if (this.authService.loggedIn()) {
      this.checkRating();
    }
    else {
      this.rating = 0;
    }
    this.getComments(this.propertyId);
    this.buildForm();
  }

  buildForm() {
    this.commentForm = this.fb.group({
      review: [null, Validators.required],
      name: [{ value: this.authService.loggedIn() == true ? this.authService.decodedToken.full_name : "", disabled: true }, Validators.compose([Validators.required, Validators.minLength(4)])],
      email: [{ value: this.authService.loggedIn() == true ? this.authService.decodedToken.email : "", disabled: true }, Validators.compose([Validators.required, emailValidator])],
      userId: [this.authService.decodedToken.user_id, Validators.required],
      propertyId: this.propertyId
    });
  }

  public getComments(propertyId: number) {
    this.commentsService.getComments(propertyId).subscribe(comments => {
      this.reviews = comments;
    });
  }

  public onRatingChanged(rating) {
    if (this.authService.loggedIn()) {
      let viewModel: RatingViewModel = {
        userId: this.authService.decodedToken.user_id,
        propertyId: this.propertyId,
        value: rating * 20
      };
      this.accountService.rating(viewModel).subscribe(res => {
        // console.log(res);
        this.snackBar.open('Rating successfully', '×', {
          verticalPosition: 'top',
          duration: 3000,
        });
        this.rating = rating;
      });
    }
    else {
      this.snackBar.open('Login to continute', '×', {
        verticalPosition: 'top',
        duration: 5000,
      });
    }
  }

  public checkRating() {
    let viewModel: CheckRatingViewModel = {
      userId: this.authService.decodedToken.user_id,
      propertyId: this.propertyId,
    };

    this.accountService.checkRating(viewModel).subscribe(res => {
      console.log(res);
      if (res == 0) {
        this.rating = res;
        return;
      }
      this.rating = res / 20;
      return;
    });
  }

  public onCommentFormSubmit(values: any) {
    if (this.authService.loggedIn()) {
      if (this.commentForm.valid) {
        let viewModel: AddCommentViewModel = {
          userId: values.userId,
          propertyId: values.propertyId,
          content: values.review
        };
        this.commentsService.addComment(viewModel).subscribe(res => {
          this.refresh();
          this.snackBar.open('Comment save successfully', '×', {
            verticalPosition: 'top',
            duration: 3000,
          });
        }, error => {
          this.snackBar.open('Comment save failed', '×', {
            verticalPosition: 'top',
            duration: 3000,
          });
        });
      }
    }
    else {
      this.snackBar.open('Login to continute', '×', {
        verticalPosition: 'top',
        duration: 5000,
      });
    }
  }
}

export enum StarRatingColor {
  primary = "primary",
}
