import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating-action',
  templateUrl: './rating-action.component.html',
  styleUrls: ['./rating-action.component.scss']
})
export class RatingActionComponent implements OnInit {

  @Input('rating') private rating: number = 0;
  @Input('starCount') private starCount: number = 5;
  @Input('color') private color: string = 'primary';
  @Output() private ratingUpdated = new EventEmitter();

  private ratingArr = [];

  constructor() { }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  public onClick(rating: number) {
    this.ratingUpdated.emit(rating);
    return false;
  }
  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
