import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  serverCreationStatus = 'No server was created.'
  serverName = 'testServer'
  serverCreated = false
  servers = []

  constructor() {
  }

  ngOnInit(): void {
  }

  onCreateSever() {
    this.serverCreationStatus = 'Server was created.'
    this.servers.push(this.serverName)
    this.serverCreated = true
  }
}
