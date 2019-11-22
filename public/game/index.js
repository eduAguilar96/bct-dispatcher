let params = [];
let lobbyName = $("#lobby-name");
let gameStartText = $("#game-start-text");
let playerRefCard = $("#player-ref-card");
let hostRefCard = $("#host-ref-card");
let preGameHostCard = $("#pre-game-host-card");
let preGameHostPlayerList  = $("#pre-game-host-player-list");
var preGameHostRoleSelect = new Array(23);
for(var i = 0; i < 23; i++){preGameHostRoleSelect[i] = false;}
let preGameHostRoleList  = $("#pre-game-host-role-list");
var preGameSelectedRolesCount = 0;
let gamePlayerCounter = $(".game-player-counter");
let gameRoleCounter = $(".game-role-counter");
let gameStartBtn = $("#game-start-btn");
let roleCard = $("#role-card");
let roleName = $("#role-name");
let roleDesc = $("#role-desc");
let roleInst = $("#role-inst");
let roleImg = $("#role-img");
let commentBtn = $("#comment-btn");
let commentField = $("#comment-field");
let gameState = {
  role: "unassigned",
  started: false,
  extra: {},
  lobbyName: "test",
  players: [],
  maxPlayerCount: 5,
  lobby_id: "",
  player_id: ""
};

let roleNameList = [
  "",
  "Washerwoman",
  "Librarian",
  "Investigator",
  "Chef",
  "Empath",
  "Fortune Teller",
  "Undertaker",
  "Monk",
  "Ravenkeeper",
  "Virgin",
  "Slayer",
  "Soldier",
  "Mayor",
  "Butler",
  "Drunk",
  "Recluse",
  "Saint",
  "Poisoner",
  "Spy",
  "Baron",
  "Scarlet Woman",
  "Imp",
];
let roleDescList = [
  "",
  "The Washerwoman learns that a specific Townsfolk is in play.",
  "The Librarian learns that a specific Outsider is in play, but not who is playing it",
  "The Investigator learns that a specific Minion is in play, but not who is playing it.",
  "The Chef learns if evil players are sitting next to each other.",
  "The Empath keeps learning whether their neighbors are evil.",
  "The Fortune Teller can detect who the Demon is, but sometimes thinks good players are Demons.",
  "The Undertaker learns which character was executed today.",
  "The Monk protects other people from the Demon.",
  "The Ravenkeeper learns any player's character, but only if they die at night",
  "The Virgin is safe from execution…perhaps. In the process, they confirm if their nominator is a Townsfolk",
  "The Slayer can kill the Demon by guessing who it is.",
  "The Soldier cannot be killed by the Demon.",
  "The Mayor can win by peaceful means on the final day",
  "The Butler may only vote when their Master votes.",
  "The Drunk thinks they are a Townsfolk and has no idea that they are actually the Drunk.",
  "The Recluse might appear evil but is actually good.",
  "The Saint ends the game if they are executed.",
  "The Poisoner secretly disrupts character abilities.",
  "The Spy knows who everyone is and might appear good, but is actually evil.",
  "The Baron changes the number of Outsiders in play.",
  "The Scarlet Woman becomes the Demon when the Demon dies.",
  "The Imp kills at night and can make copies of itself…for a terrible price"
];
let roleInstList = [
  [],
  [
    `During the first night, the Washerwoman is woken, shown two players, and
      learns the character of one of them.`,
    "They learn this only once and then learn nothing more."
  ],
  [
    `On the first night of the game, the Librarian learns that
      one of two players is a specific Outsider. `,
    "The Librarian learns the true character(Drunk, Lunatic) of the player."
  ],
  [
    `During the first night, the Investigator is woken and
      shown two players, but only learns the character of one
      of them. `,
    "They learn this only once and then learn nothing more."
  ],
  [
    `On the first night, the Chef learns exactly how many pairs
      there are in total. A pair is two players, but one player
      may be a part of two pairs. So, two players sitting next to
      each other count as one pair, three players sitting next to
      each other count as two pairs. Four players sitting next to
      each other count as three pairs. And so on.`,
    `The Chef detects evil Travelers just like other character
      types, but only if those Travelers joined the game before
      the Chef acts.`
  ],
  [
    `The Empath only learns how many of their neighbors are
      evil, not which one is evil.`,
    `The Empath does not detect dead players. So, if the
      Empath is sitting next to a dead player, the information
      refers not to the dead player, but to the closest alive
      player in that direction`,
    `The Empath acts after the Demon, so if the Demon kills
      one of the Empath’s alive neighbors, the Empath does
      not learn about the now-dead player. The Empath's
      information is accurate at dawn, not at dusk.`,
  ],
  [
    `Each night, the Fortune Teller chooses two players and
      learns if at least one of them is a Demon. They do not
      learn which of them is a Demon, just that one of them is.
      If neither is the Demon, they learn this instead.`,
    `Unfortunately, one player, called the Red Herring, will
      register as a Demon to the Fortune Teller if chosen. The
      Red Herring is the same player throughout the entire
      game. This player may be any good player, even the
      Fortune Teller, and the Fortune Teller does not know
      which player it is`,
    `The Fortune Teller may choose any two players—alive or
      dead, or even themself. If they choose a dead Demon,
      then the Fortune Teller still receives a nod.`
  ],
  [
    `The player must have died from execution for the
      Undertaker to learn who they are. Deaths during the day
      for other reasons, such as the Gunslinger<T> choosing a
      player to kill, or the exile of a Traveler, do not count.
      Execution without death—rare as it is—does not count.`,
    `The Undertaker learns the true character of the executed
      player.`,
    `The Undertaker wakes each night except the first, as
      there have been no executions yet. If nobody died by
      execution today, then the Undertaker learns nothing at
      all.`
  ],
  [
    `Each night except the first, the Monk may choose to
      protect any player except themself.`,
    `If the Demon attacks a player who has been protected by
      the Monk, then that player does not die. The Demon
      does not get to attack another player—there is simply no
      death tonight.`,
    `The Monk does not protect against harmful effects
      caused by non-Demon characters, such as poisoning,
      drunkenness, or Outsider penalties.`,
  ],
  [
    `The Ravenkeeper is woken on the night that they die this
      way, and chooses a player immediately.`,
    `The Ravenkeeper may choose a dead player if they wish.`
  ],
  [
    `If a Townsfolk nominates the Virgin, then that Townsfolk
      is executed immediately. Because there can only be one
      execution per day, the nomination process immediately
      ends, even if a player was about to die.`,
    `Only Townsfolk are executed due to the Virgin's ability. If
      an Outsider, Minion, or Demon nominates the Virgin,
      nothing happens, and voting continues.`,
    `The Virgin’s ability is powerful because if a Townsfolk
      nominates them and dies, then both characters are
      almost certainly Townsfolk.`,
    `After being nominated for the first time, the Virgin loses
      their ability, even if the nominator did not die, and even
      if the Virgin was poisoned or drunk.`
  ],
  [
    `The Slayer can choose to use their ability at any time
      during the day, and must declare to everyone when
      they’re using it. If the Slayer chooses the Demon, the
      Demon dies immediately. Otherwise, nothing happens.`,
    `The players do not learn the identity of the dead player.
      After all, it may have been the Recluse!`,
    `When the Slayer declares that they wish to use their
      power, it is a good idea to give the group a few minutes
      to discuss who the Slayer should choose, but the Slayer
      makes the final decision`,
    `A Slayer that uses their ability while poisoned or drunk
      may not use it again.`,
  ],
  [
    `The Soldier cannot be affected by the Demon’s ability in
      any way. So, if the Imp attacks the Soldier at night,
      nothing happens. The Imp does not get to choose
      another player to attack instead.`,
    `The Soldier can still be killed by execution, even if the
      nominator was the Demon. The Soldier is protected from
      the Demon’s ability, not the actions of the Demon player.`,
  ],
  [
    `To survive, the Mayor sometimes "accidentally" gets
      someone else killed. If the Mayor is attacked, you may
      choose that a different player dies. Nobody learns how
      the player died at night, just that they died.`,
    `If there are just three players alive at the end of the day,
      and no execution occurred that day, then the Mayor
      wins, which means that the good team wins too.`,
    `Travelers do count as players when counting for the
      Mayor’s victory, so they must be exiled first. Remember
      that exiles are not executions.`,
    `Fabled characters do not count as players when counting
      for the Mayor’s victory, as the Storyteller does not count
      as a player.`,
  ],
  [
    `Each night, the Butler chooses a player to be their
      Master. On the next day, the Butler may only have their
      hand raised to vote if their Master also has their hand
      raised to vote—whether or not the Master’s vote has
      been counted yet.`,
    `The Master, as normal, may not raise their hand to vote
      if dead and without a vote token.`,
    `It is not the Storyteller’s responsibility to monitor the
      Butler. They’re responsible for their own voting. If they
      accidentally vote when they shouldn’t, the Storyteller will
      count the vote as normal. However, repeating this
      behavior is considered cheating.`,
    `Because any player can vote for an exile, and exiles are
      never affected by abilities, the Butler can vote freely for
      an exile.`
  ],
  [
    `During setup, the Drunk's token does not go in the bag.
      Instead, a Townsfolk character token goes in the bag, and
      the player who draws that token is secretly the Drunk for
      the whole game. You know. They do not.`,
    `The Drunk has no ability. Whenever their Townsfolk
      ability would affect the game in some way, it doesn't.
      However, you pretend they are the Townsfolk they think
      they are. If that character would wake at night, wake the
      Drunk instead and act as if they are the Townsfolk. If that
      Townsfolk would gain information, you may give them
      false information instead—and you’re encouraged to do
      so.`
  ],
  [
    `Whenever the Recluse’s alignment is detected, the
      Storyteller chooses whether the Recluse registers as
      good or evil.`,
    `Whenever the Recluse is targeted by an ability that
      affects specific Minions or Demons, the Storyteller
      chooses whether the Recluse registers as that specific
      Minion or Demon`,
    `The Recluse may register as either good or evil, or as an
      Outsider, Minion, or Demon, at different parts of the
      same night. The Storyteller chooses whatever is most
      interesting.`,
  ],
  [
    `If the Saint dies by execution, the Saint loses. Because
      teams always win and lose together, good loses and evil
      wins.`,
    `If the Saint dies in any way other than execution—such
      as the Demon killing them—then the game continues.`,
  ],
  [
    `Each night, the Poisoner chooses someone to poison for
      that night and the entire next day.`,
    `A poisoned player has no ability, but you pretend they
      do. They do not affect the game in any real way.
      However, to keep up the illusion that the poisoned player
      is not poisoned, wake them at the appropriate time and
      go through the motions as if they were not poisoned. If
      their ability gives them information, you may give them
      false information.`,
    `If a poisoned player uses a "once per game" ability while
      poisoned, they cannot use their ability again.`,
  ],
  [
    `If any character has an ability that would detect or affect
      a good player, then the Spy might register as good to that
      character. If any character has an ability that detects
      Townsfolk or Outsiders, then the Spy might register as a
      specific Townsfolk or Outsider to that player. As always,
      it is your choice as to what the Spy registers as, even as
      many characters or both alignments during the same
      night.`,
    `Remember to keep your Grimoire tidy, and show it to the
      Spy in the correct orientation, so the Spy can easily see
      who is who.`
  ],
  [
    `This change happens during setup, and does not revert if
      the Baron dies. A change in characters during setup,
      regardless of what happens during the game, is shown on
      character sheets and tokens within square brackets at
      the end of a character description—like [this].`,
    `The added Outsiders always replace Townsfolk, not other
      character types.`,
  ],
  [
    `If there are five or more players just before the Demon
      dies—that is, four or more players left alive after the
      Demon dies—then the Scarlet Woman immediately
      becomes the Demon, and the game continues as if
      nothing happened. `,
    `Travelers do not count as players to see if the Scarlet
      Woman’s ability triggers.`,
    `If less than five players were alive when the Demon is
      executed, then the game ends and good wins.`,
    `If there are five or more players alive when the Demon
      dies at night, the Scarlet Woman must be the new Imp.`,
    `If the Scarlet Woman becomes the Demon, they are that
      Demon in every way. Good wins if they are executed.
      They kill each night. They register as the Demon.`,
  ],
  [
    `On each night except the first, the Imp chooses a player
      to kill. Because most characters act after the Demon, that
      player will probably not get to use their ability tonight.`,
    `The Imp, because it’s a Demon, knows which players are
      their Minions, and knows three not-in-play good
      characters that they can safely bluff as`,
    `If the Imp dies, the game ends and good wins. However,
      if the Imp kills themself at night, they die and an alive
      Minion becomes an Imp. This new Imp does not act that
      same night, but is now the Imp in every other way—they
      kill each night, and lose if they die.`
  ]
];
let stateIconMap = [
  `<svg class="icon" id="i-heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="21" height="21" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M4 16 C1 12 2 6 7 4 12 2 15 6 16 8 17 6 21 2 26 4 31 6 31 12 28 16 25 20 16 28 16 28 16 28 7 20 4 16 Z" />
  </svg>`,
  `<svg  class="icon" id="i-alert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="21" height="21" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M16 3 L30 29 2 29 Z M16 11 L16 19 M16 23 L16 25" />
  </svg>`,
  `<svg  class="icon" id="i-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="21" height="21" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M16 14 L16 23 M16 8 L16 10" />
    <circle cx="16" cy="16" r="14" />
  </svg>`,
  `<svg class="icon" id="i-user" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="21" height="21" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M22 11 C22 16 19 20 16 20 13 20 10 16 10 11 10 6 12 3 16 3 20 3 22 6 22 11 Z M4 30 L28 30 C28 21 22 20 16 20 10 20 4 21 4 30 Z" />
  </svg>`
];
let stateStringMap = [
  "- Alive -",
  "- Dead - can vote -",
  "- Dead - no vote -"
];
let stateColorMap = [
  "green",
  "blue",
  "red"
];

function handleError(error){
  console.log(error);
  if(error.hasOwnProperty('responseJSON')){
    window.alert(error.responseJSON.code+" - "+error.responseJSON.message);
  }else{
    window.alert("500 - Error in DB");
  }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function renderRoleReference(){
  $('#role-list li').remove();
  $.each(roleNameList, (index, name) => {
    if(index == 0 ){ return; }
    $('#role-list').append(`
      <li class="list-group-item role-reference-li">
        <button class="btn btn-secondary btn-role-details" type="button" data-toggle="collapse" data-target="#role-`+index+`" aria-expanded="false" aria-controls="role-role-`+index+`">
          ...
        </button>
        <img src="../../images/`+index+`.png" width="25" height="25" />`
        +name+
      `</li>
      <div id="role-`+index+`" class="collapse">
        <li class="list-group-item role-reference-details-li">
          `+roleDescList[index]+`
        </li>
      </div>
    `);
  });
}

function renderRoleHostList(){
  $("#pre-game-host-role-list li").remove();
  $.each(roleNameList, (index, name) => {
    if(index == 0 ){ return; }
    $("#pre-game-host-role-list").append(`
      <li class="list-group-item">
        <input class="form-check-input" type="checkbox" value="`+index+`" id="role-checkbox-`+index+`">
        <img src="../../images/`+index+`.png" width="25" height="25" />
        <label class="form-check-label" for="role-checkbox-`+index+`">
          `+name+`
        </label>
      </li>
    `);
  });
}

function renderPlayerRef(){
  playerRefCard.css("display","block");
  $("#player-ref-card ul li").remove();
  $.each(gameState.players, (index, player) => {
    let stateIcon = stateIconMap[player.state];
    if(gameState.player_id == player._id){
      stateIcon = stateIconMap[3];
    }
    let stateString = stateStringMap[player.state];
    let stateColor = stateColorMap[player.state];
    $("#player-ref-card ul").append(`
      <li class="list-group-item">
        `+stateIcon+`
        <span class="name-container">
          `+player.name+`
        </span>
        <span class="state-container" style="color:`+stateColor+`;">
          `+stateString+`
        </span>
      </li>
    `);
  });
}

function renderHostRef(){
  hostRefCard.css("display","block");
  $("#host-ref-card ul li").remove();
  $.each(gameState.players, (index, player) => {
    let stateIcon = stateIconMap[player.state];
    let stateString = stateStringMap[player.state];
    let stateColor = stateColorMap[player.state];
    $("#host-ref-card ul").append(`
      <li class="list-group-item">
        <button class="btn btn-secondary btn-kill" type="button">
          <svg id="i-activity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="25" height="25" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M4 16 L11 16 14 29 18 3 21 16 28 16" />
          </svg>
        </button>
        `+stateIcon+`
        <span class="name-container">`+player.name+`</span>
        <span class="state-container" style="color:`+stateColor+`;">
          `+stateString+`
        </span>
        <span class="role-container">
          `+roleNameList[player.role]+`
          <img src="../../images/`+player.role+`.png" width="25" height="25" />
        </span>
      </li>
    `);
  });
}

function renderCharacterCard(roleIndex) {
  // console.log("rendering character card with index: " + roleIndex);
  roleCard.css("display", "block");
  roleName.text(roleNameList[roleIndex]);
  roleImg.attr("src","../../images/"+roleIndex+".png");
  roleDesc.text(roleDescList[roleIndex]);
  $.each(roleInstList[roleIndex], (index, desc) => {
    $(roleInst).append('<li class="list-group-item">'+desc+"</li>");
  });
}

function renderCommentSection(comments) {
  $("#comment-list li").remove();
  $.each(comments, (index, comment) => {
    $("#comment-list").append(`
      <li class="list-group-item">
        <b>`+comment.player_name+`:</b> `+comment.desc+`
      </li>
    `);
  });
}

function getCommentSection(){
  $.ajax({
    url: "/comment",
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify({lobby: gameState.lobby_id}),
    success: (result) => {
      console.log(result);
      result.sort((a,b) => {
        return new Date(b.created) - new Date(a.created);
      });
      console.log(result);
      renderCommentSection(result);
    },
    error: (error) => {
      handleError(error);
    }
  });
}

function renderGameState(){
  // console.log("rendering Game State");
  lobbyName.text("Lobby: "+gameState.lobbyName);
  gamePlayerCounter.text(gameState.players.length+"/"+gameState.maxPlayerCount);
  let isHost = params.player == 0;
  getCommentSection();
  //If player is host
  if(isHost){
    gameStartText.text("");
    // console.log(gameState);
    //If host and In-Game
    if(gameState.started){
      preGameHostCard.css("display", "none");
      renderHostRef();
    }
    //if host and Pre-game
    else{
      preGameHostCard.css("display", "block");
      //render player list
      $.each(gameState.players, (index, player) => {
        $(preGameHostPlayerList).append(`
          <li class="list-group-item">`
            +(index+1)+`: `+player.name+
          `</li>
        `);
      });
      //render role list
      gameRoleCounter.text(preGameSelectedRolesCount+"/"+gameState.players.length);
      renderRoleHostList();
    }
  }
  //if normal player
  else{
    //if player and In-game
    if(gameState.started){
      gameStartText.text("");
      let roleIndex = gameState.role;
      if(roleIndex != 0){renderCharacterCard(roleIndex);}
      renderPlayerRef();
    }
    //if player and Pre-game
    else{
      gameStartText.text("Waiting for Game to start...");

    }
  }
}

function updateGameState(){
  // console.log("updateing Game State");
  gameState.player_id = params.player;
  gameState.lobby_id = params.lobby;
  // console.log(gameState);
  renderGameState();
}

function getGameState(){
  // console.log("getting Game State");
  let game = {
    lobby_id: params.lobby,
    player_id: params.player
  }
  $.ajax({
    url: "/gameState",
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(game),
    success: (result) => {
      gameState = result;
      updateGameState();
    },
    error: (error) => {
      handleError(error);
    }
  });
}

gameStartBtn.on('click', event =>{
  // console.log("click");
  let lobby = {
    lobby_id: params.lobby,
    available_roles: preGameHostRoleSelect,
    roles_count: preGameSelectedRolesCount
  }
  $.ajax({
    url: "/gameStart",
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(lobby),
    success: (result) => {
      getGameState();
    },
    error: (error) => {
      handleError(error);
    }
  });
});

commentBtn.on('click', event => {
  let comment = commentField.val();
  let player_id = gameState.player_id;
  let player = (gameState.players.find(e => e._id == player_id));
  let player_name = (player == undefined) ? "Host" : player.name;
  let lobby_id = gameState.lobby_id;
  let body = {
    comment: comment,
    player_name: player_name,
    player_id: player_id,
    lobby_id: lobby_id
  }
  $.ajax({
    url: "/commentNew",
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(body),
    success: (result) => {
      console.log(result);
      commentField.val("");
      getGameState();
    },
    error: (error) => {
      handleError(error);
    }
  });
})

$("#pre-game-host-role-list").on("change", "li input[type='checkbox']", event => {
  let val = $(event.target).val();
  // console.log(val);
  preGameHostRoleSelect[val] = !preGameHostRoleSelect[val];
  (preGameHostRoleSelect[val]) ? preGameSelectedRolesCount++ : preGameSelectedRolesCount--;
  gameRoleCounter.text(preGameSelectedRolesCount+"/"+gameState.players.length);
});

$("#host-ref-card").on("click", "ul li .btn-kill", event => {
  // console.log("click");
  // console.log($(event.currentTarget));
  let playerName = $(event.currentTarget).parent().children(".name-container").text();
  // console.log("\'"+playerName+"\'");
  let current_state = (gameState.players.find(e => e.name == playerName)).state;
  let body = {
    player_name: playerName,
    lobby_id: gameState.lobby_id,
    current_state: current_state
  }
  $.ajax({
    url: "/playerKill",
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(body),
    success: (result) => {
      // console.log(result);
      getGameState();
    },
    error: (error) => {
      handleError(error);
    }
  });
});

params = getUrlVars();
renderRoleReference();
getGameState();
