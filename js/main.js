const prop_names = ["anticapitalism", "baseThirst", "buoyancy", "​chasiness", "coldness", "​continuation", "​divinity", "groundFriction", "​indulgence", "laserlikeness", "​martyrdom", "moxie", "musclitude", "omniscience", "overpowerment", "​patheticism", "pressurization", "​ruthlessness", "shakespearianism", "​soul", "suppression", "​tenaciousness", "thwackability", "​totalFingers", "tragicness", "​unthwackability", "watchfulness", "deceased"]
const prop_abbvr = ["anticap", "thrst", "float", "chase", "cold", "cont", "divin", "fric", "indlg", "laser", "martyr", "moxie", "muscl", "omnisc", "op", "pathtc", "prssr", "ruth", "ssper", "soul", "supp", "tenac", "thwack", "finger", "tragic", "unthwk", "watch", "dead"]
Vue.component("player-deets", {
	props: ['player'],
	template: `
		<div class="player">
			<span class="name">{{player.name}} {{player.stars}}*</span>
			<span class="prop" :class="divineProp(prop, index)" v-for="(prop, index) in player.props">{{roundNicely(prop)}}</span>
		</div>
	`,
	methods: {
		roundNicely: function(prop) {
			if (typeof(prop) == "boolean") return "dead" ? "alive" : prop
			else if (prop == Math.round(prop)) return prop
			else return prop.toFixed(3)
		},
		divineProp: function(prop, index) {
			var whichprop = prop_names[index];
			//console.log(whichprop, prop)
			if (whichprop === "deceased") return {"bad":true} ? "" : prop
			if (whichprop === "​totalFingers") {
				if (prop == 10) return ""
				else return {"good":true}
			} else if (whichprop === "​soul") return ""
			else if (whichprop === "tragicness") {
				if (prop > 0) return {"bad":true}
				else return ""
			}
			else if (prop > 0.9) return {"great":true}
			else if (prop > 0.7) return {"good":true}
			else if (prop > 0.4) return {"ok":true}
			else return {"bad":true}
		}
	}
})

var app = new Vue({
	el: '#app',
	data: {
		prop_names: prop_names,
		prop_abbvr: prop_abbvr,
		teams: [],
		selected_team: 0
	}
});


function stars(e, bat) {
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
				"stars": stars(player, bat)
			};
			for (key of Object.keys(player).sort()) {
				if (key != "name" && key != "_id" && key != "deceased") {
					new_player.props.push(player[key])
				}
			};
			new_player.props.push(player["deceased"])
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


