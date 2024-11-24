import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list-item.component.html',
  styleUrl: './user-list-item.component.scss'
})
export class UserListItemComponent {
  @Input() username!: string; // Channel description
  @Input() status: boolean = false;
  @Input() img!: string;

  fallbackImg: string = 'https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg';

  // Method to handle image loading errors
  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.fallbackImg;  // Set fallback image when error occurs
  }
}