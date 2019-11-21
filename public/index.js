let lobbyHostName = $("#lobby-host");
let lobbyName = $("#lobby-name");
let lobbyPassword = $("#lobby-password");
let lobbyMaxPlayerCount = $("#lobby-max");
let joinLobbyUsername = $("#join-lobby-username");
let joinLobbyPassword = $("#join-lobby-password");
let btnCreate = $("#btn-create");
let btnJoin = $("#btn-join-lobby-modal");
let listContainer = $("#lobby-list-container");

var global_list = [{
  name: "test"
}];
var currentLobbyName = "";

function handleError(error){
  console.log(error);
  if(error.hasOwnProperty('responseJSON')){
    window.alert(error.responseJSON.code+" - "+error.responseJSON.message);
  }else{
    window.alert("500 - Error in DB");
  }
}

function lobbyLi(lobby){
  let li = `
  <li class="list-group-item list-group">
    <div class="btn-group action-btn-container" role="group" aria-label="Buttons">
      <button class="btn btn-outline-primary btn-sm" id="btn-join">
        Join
      </button>
      <button class="btn btn-outline-primary btn-sm" id="btn-heart">
        <svg id="i-heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="21" height="21" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M4 16 C1 12 2 6 7 4 12 2 15 6 16 8 17 6 21 2 26 4 31 6 31 12 28 16 25 20 16 28 16 28 16 28 7 20 4 16 Z" />
        </svg>
      </button>
    </div>
    <span class="player-counter">
      <svg id="i-user" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="21" height="21" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M22 11 C22 16 19 20 16 20 13 20 10 16 10 11 10 6 12 3 16 3 20 3 22 6 22 11 Z M4 30 L28 30 C28 21 22 20 16 20 10 20 4 21 4 30 Z" />
      </svg>
      `+lobby.playerCount+`/`+lobby.maxPlayerCount+`
    </span>
    <span id="name-container">`+lobby.name+`</span>
  </li>
  `
  return li;
}

function update_list() {
  $('#lobby-list-container ul li').remove();
  $.each(global_list, (index, lobby) => {
    $('#lobby-list-container ul').append(lobbyLi(lobby));
  });
}

function get_list() {
  $.ajax({
    url: "/lobby",
    method: "GET",
    dataType: "JSON",
    success: (result) => {
      console.log(result);
      global_list = result;
      update_list();
    },
    error: (error) => {
      handleError(error);
    }
  });
}

function gotoGame(result){
  console.log("result");
  console.log(result);
  let lobby_id = result.lobby_id;
  let player_id = result.player_id;
  window.location.assign("/game/?lobby="+lobby_id+"&player="+player_id);
}

btnCreate.on("click", event => {
  event.preventDefault();

  let lobby = {
    hostName: lobbyHostName.val(),
    name: lobbyName.val(),
    password: lobbyPassword.val(),
    maxPlayerCount: lobbyMaxPlayerCount.val()
  }

  $.ajax({
    url: "/lobby",
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(lobby),
    success: (result) => {
      get_list();
    },
    error: (error) => {
      handleError(error);
    }
  });

  $('#new-lobby-modal').modal('toggle')
  lobbyHostName.val('')
  lobbyName.val('')
  lobbyPassword.val('')
});

listContainer.on("click", "ul li #btn-join", event => {
  event.preventDefault();
  let lobbyName = $(event.target).parent().parent().children("#name-container").text();
  currentLobbyName = lobbyName;
  $('#join-lobby-modal-name').text(lobbyName);
  $('#join-lobby-modal').modal('toggle');
});

btnJoin.on("click", event => {
  event.preventDefault();
  let username = joinLobbyUsername.val();
  let password = joinLobbyPassword.val();
  let lobby_id = global_list.find(e => e.name == currentLobbyName)._id;
  let player = {
    username: username,
    password: password,
    lobby_name: currentLobbyName,
    lobby_id: lobby_id
  }

  $.ajax({
    url: "/player",
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(player),
    success: (result) => {
      get_list();
      gotoGame(result);
    },
    error: (error) => {
      handleError(error);
    }
  });
});

get_list();
