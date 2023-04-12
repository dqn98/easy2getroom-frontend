import { Component, OnInit, ViewChild } from '@angular/core';
import { Announcement } from 'src/app/app.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { UpdateAnnouncementStatusViewModel } from 'src/app/viewModels/updateAnnouncementStausViewModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  private sub: any;
  displayedColumns: string[] = ['content', 'type', 'date', 'isRead', 'actions'];
  announcements: Announcement[] = [];
  dataSource: MatTableDataSource<Announcement>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public appService: AppService,
    public accountService: AccountService,
    public authService: AuthService,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.announcements = [];
    this.appService.getAnnouncements().subscribe(announcements => {
      announcements.forEach(announcement => {
        this.announcements.push(announcement);
      });
      this.dataSource = new MatTableDataSource(this.announcements);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public markRead(announcement: Announcement) {
    let viewModel: UpdateAnnouncementStatusViewModel = {
      id: announcement.id,
      isRead: true
    };
    this.accountService.updateAnnouncementStatus(viewModel).subscribe(() => {
      const index: number = this.dataSource.data.indexOf(announcement);
      console.log(index);
      console.log(this.appService.Data.announcements);
      if (index !== -1) {
        this.appService.Data.announcements.splice(0, 1);
      }
      this.refresh();
    });
  }

  public markUnread(announcement: Announcement) {
    let viewModel: UpdateAnnouncementStatusViewModel = {
      id: announcement.id,
      isRead: false
    };
    this.accountService.updateAnnouncementStatus(viewModel).subscribe(res => {
      this.appService.Data.announcements.push(announcement);
      this.refresh();
    });
  }

  public remove(announcement: Announcement) {
    this.accountService.removeAnnouncement(announcement.id).subscribe(() => {
      const index: number = this.dataSource.data.indexOf(announcement);
      if (index !== -1) {
        this.appService.Data.announcements.splice(index, 1);
      }
      this.refresh();
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
