import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- this is required
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule],  // <-- import RouterModule here
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {}
