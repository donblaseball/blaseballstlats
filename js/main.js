const prop_names = ["anticapitalism", "baseThirst", "buoyancy", "chasiness", "cinnamon", "coldness", "continuation", 
				"deceased", "divinity", "fate", "groundFriction", "indulgence", "laserlikeness", "martyrdom", "moxie", "musclitude", 
				"omniscience", "overpowerment", "patheticism", "peanutAllergy", "pressurization", "ruthlessness", "shakespearianism", 
				"soul", "suppression", "tenaciousness", "thwackability", "totalFingers", "tragicness", "unthwackability", "watchfulness"]; //properties
const prop_abbvr = ["anticap", "thrst", "float", "chase", "cinnm", "cold", "cont", 
			"dead", "divin", "fate", "fric", "indlg", "laser", "martyr", "moxie", "muscl", 
			"omnisc", "op", "pathtc", "allergy", "prssr", "ruth", "ssper", 
			"soul", "supp", "tenac", "thwack", "fingers", "tragic", "unthwk", "watch"]; //the abbreviations. respective, order must be maintained.
const prop_negative = ["thwackability", "patheticism"]; //very bad dislike having this
const prop_bool = ["deceased", "peanutAllergy"]; //currently all bools are also negative. this could be solved with a typeof()==boolean but this is here for uniformity™ 
const prop_banned = ["_id", "name", "bat"]; //very bad stat no good do not include
const prop_nodivine = ["fate", "soul"]; //don't divine this
const base_tragicness = 0.1; //tragicness went up in season 3 so this is here if it goes up again


Vue.component("player-deets", {
	props: ['player'],
	template: `
		<div class="player">
			<span class="name">
				<span class="customBat" v-if="player.batName != ''" :title="player.batName">🏏</span>
				{{player.name}} 
				{{player.stars}}*
			</span>
			<span class="prop" :class="divineProp(prop, index)" v-for="(prop, index) in player.props">{{roundNicely(prop)}}</span>
		</div>
	`,
	methods: {
		roundNicely: function(prop) { //disdplay a prop nice and good
			if (typeof(prop) == "boolean") { //this would be a ternary if but js doesn't want me to have nice things
				if (prop) return "yes"
				else return "no"
			}
			else if (prop == Math.round(prop)) return prop
			else return prop.toFixed(3)
		},
		divineProp: function(propv, index) {
			var whichprop = prop_names[index];
			var prop = propv;
			//console.log(whichprop, prop)
			if (prop_negative.includes(whichprop)) prop = 1 - propv; //prop is negative, low prop is good

			if (prop_bool.includes(whichprop)) {//prop is boolean
				if (prop) return {"bad":true} //this would be a ternary if but js doesn't want me to have nice things
				else return ""  
			} 
			else if (prop_nodivine.includes(whichprop)) return "" //fuck knows what this is lmfao

			else if (whichprop === "totalFingers") { //fingers, 10 is normal everything else is good
				if (prop == 10) return ""
				else return {"good":true}
			} 

			else if (whichprop === "tragicness") { //tragicness is bad if not base_tragicness but fine if it is
				if (prop > base_tragicness) return {"bad":true}
				else if (prop == base_tragicness) return ""
				else return {"great":true} //???
			}

			else if (prop > 0.9) return {"great":true} //normal rules
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


