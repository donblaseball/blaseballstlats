var app = new Vue({
	el: '#app',
	data: {
		prop_names: prop_names,
		prop_abbvr: prop_abbvr,
		teams: [],
		selected_team: 0
	}
});

function stars(e, bat) { //thank u SIBR
	var coeff = 0;
	if (bat) {
		coeff = Math.pow(1 - e.tragicness, .01) * Math.pow(e.buoyancy, 0) * Math.pow(e.thwackability, .35) * Math.pow(e.moxie, .075) * Math.pow(e.divinity, .35) * Math.pow(e.musclitude, .075) * Math.pow(1 - e.patheticism, .05) * Math.pow(e.martyrdom, .02)
	} else {
		coeff = Math.pow(e.shakespearianism, .1) * Math.pow(e.suppression, 0) * Math.pow(e.unthwackability, .5) * Math.pow(e.coldness, .025) * Math.pow(e.overpowerment, .15) * Math.pow(e.ruthlessness, .4)
	}
	return Math.round(coeff * 10)/2
}

function getPlayers(ids, bat) {
	return fetch("https://blaseball.com/database/players?ids=" + ids.join(","))
	  .then(function(response) {
	   	return response.json()
	}).then(function(players) {
		var new_players = [];
		for (const player of players) {
			var new_player = {
				"name": player.name,
				"props": [],
				"batter": bat,
				"stars": stars(player, bat),
				"batName": player.bat
			};
			for (key of Object.keys(player).sort()) {
				if (!prop_banned.includes(key)) {
					new_player.props.push(player[key])
				}
			};
			new_players.push(new_player);
		};
		return new_players
	})//.catch(e => console.log("couldn't get players, error:", e))
}

async function getTeam(team) {
	var t = {
		"name": team.fullName,
		"color1" : team.mainColor,
		"color2" : team.secondaryColor,
		"icon": String.fromCodePoint(Number(team.emoji)),
		"slogan": team.slogan,
		"lineup": [],
		"rotation": []
	};
	t.lineup = await getPlayers(team.lineup, true);
	t.rotation = await getPlayers(team.rotation, false);
	return t
}

fetch('https://blaseball.com/database/allTeams')
  .then(function(response) {
  	return response.json();
}).then(function(response) {
  	for (const team of response) {
    	getTeam(team).then(t => app.teams.push(t))
	}
})//.catch(e => console.log("sad times couldn't get teams. error:", e))


