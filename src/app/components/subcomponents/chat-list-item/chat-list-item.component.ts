import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingService } from '../../../messaging.service';

@Component({
  selector: 'app-chat-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss'
})
export class ChatListItemComponent {
  
  @Input() name!: string; // Channel name
  @Input() description!: string; // Channel description
  @Input() img!: string;

  constructor(private messagingService: MessagingService) {}

  isSelected = false; 

  ngOnInit() {
    // Subscribe to current channel selection
    this.messagingService.currentChannel$.subscribe((currentChannel) => {
      this.isSelected = currentChannel === this.name;  // Check if this channel is selected
    });
  }

  // Method to handle channel selection
  onSelectChannel() {
    this.messagingService.setCurrentChannel(this.name); // Set the current channel when clicked
    console.log("selected Channel: " + this.name)
    this.onSelect() 
  }
  isClicked = false;

  onSelect() {
    this.isClicked = !this.isClicked; // Toggle the clicked state
  }
}
