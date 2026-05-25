import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND } from '../../../shared/brand';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class Footer {
  protected readonly brand = BRAND;
}
