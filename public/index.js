console.log("Hello World");

var updated_lobbies = ["lobby1", "lobby2", "lobby3", "lobby4", "lobby5", "lobby6"];

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
      0/8
    </span>
    `+lobby+`
  </li>
  `
  return li;
}

function update_list(updated_lobbies) {
  console.log("initiating update");
  $('#lobby-list-container ul li').remove();

  $.each(updated_lobbies, (index, lobby) => {
    $('#lobby-list-container ul').append(lobbyLi(lobby));
  });
}


update_list(updated_lobbies);
