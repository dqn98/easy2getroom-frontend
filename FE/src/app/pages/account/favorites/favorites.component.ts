import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from 'src/app/services/account.service';
import { FavoriteViewModel } from 'src/app/viewModels/favoriteViewModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'actions'];
  favorites: Property[] = [];
  dataSource: MatTableDataSource<Property>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public appService: AppService, public accountService: AccountService, public authService: AuthService) { }

  ngOnInit() {
    this.refresh();
  }

  public remove(property: Property) {

    let viewModel: FavoriteViewModel = {
      userId: this.authService.decodedToken.user_id,
      propertyId: property.id
    }

    this.accountService.unfavorite(viewModel).subscribe(res => {
      this.refresh();
      const index: number = this.dataSource.data.indexOf(property);
      if (index !== -1) {
        this.appService.Data.favorites.splice(index, 1);
      }
    });
  }

  refresh() {
    this.favorites = [];
    this.appService.getFavorites().subscribe(favorites => {
      favorites.forEach(property => {
        this.favorites.push(property);
      });
      this.dataSource = new MatTableDataSource(this.favorites);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
