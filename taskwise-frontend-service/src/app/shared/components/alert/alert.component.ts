import { Component, EventEmitter, Input, input, Output } from "@angular/core";

@Component({
  selector: "app-alert",
  standalone: true,
  imports: [],
  templateUrl: "./alert.component.html",
  styleUrl: "./alert.component.scss",
})
export class AlertComponent {
  @Input() message: string = "This is an alert";
  @Input() color: string = "red";
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();

  onCloseAlert() {
    this.closeEvent.emit(true);
  }
}
