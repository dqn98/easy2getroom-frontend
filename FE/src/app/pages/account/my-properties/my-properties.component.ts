import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from 'src/app/services/account.service';
import { GetUserPropertiesViewModel } from 'src/app/viewModels/getUserPropertiesViewModel';
import { AuthService } from 'src/app/services/auth.service';
import { ClientUpdateStatusViewModel } from 'src/app/viewModels/clientUpdateStatusViewModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeletePropertyViewModel } from 'src/app/viewModels/deletePropertyViewModel';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.scss']
})
export class MyPropertiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'published', 'views', 'status', 'actions'];
  dataSource: MatTableDataSource<Property>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public appService: AppService,
    public accountService: AccountService,
    public authService: AuthService,
    private snackBar: MatSnackBar,) { }

  ngOnInit() {
    this.refresh();
  }

  public refresh() {
    let viewModel: GetUserPropertiesViewModel = {
      userId: this.authService.decodedToken.user_id
    };
    this.accountService.getMyProperties(viewModel).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public remove(property: Property) {
    const viewModel: DeletePropertyViewModel = {
      propertyId: property.id,
      userId: this.authService.decodedToken.user_id
    };
    this.accountService.deleteProperty(viewModel).subscribe(() => {
      this.refresh();
      this.snackBar.open('The property "' + property.title + '" has been deleted.', '×', {
        verticalPosition: 'top',
        duration: 3000
      });
    }, error => {
      this.snackBar.open('The property "' + property.title + '" is not delete.', '×', {
        verticalPosition: 'top',
        duration: 3000
      });
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public hide(property: Property) {
    const viewModel: ClientUpdateStatusViewModel = {
      id: property.id,
      status: 0, // Inactive status
      userId: this.authService.decodedToken.user_id
    };
    this.accountService.updateStatus(viewModel).subscribe(() => {
      this.refresh();
      this.snackBar.open('The property "' + property.title + '" has been set hided.', '×', {
        verticalPosition: 'top',
        duration: 3000
      });
    }, error => {
      this.snackBar.open('The property "' + property.title + '" is not hided.', '×', {
        verticalPosition: 'top',
        duration: 3000
      });
    });
  }


  public unhide(property: Property) {
    const viewModel: ClientUpdateStatusViewModel = {
      id: property.id,
      status: 1, // Active status
      userId: this.authService.decodedToken.user_id
    };
    this.accountService.updateStatus(viewModel).subscribe(() => {
      this.refresh();
      this.snackBar.open('The property "' + property.title + '" has been set unhided.', '×', {
        verticalPosition: 'top',
        duration: 3000
      });
    }, error => {
      this.snackBar.open('The property "' + property.title + '" is not unhided.', '×', {
        verticalPosition: 'top',
        duration: 3000
      });
    });
  }

}