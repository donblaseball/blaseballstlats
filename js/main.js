var app = new Vue({
	el: '#app',
	data: {
		prop_cats: prop_cats,
		abbreviations: abbreviations,
		teams: [],
		selected_team: 0,
		load_fails: 0,
		failed_teams: false,
		colourset: "default",
		sort_ord: 'asc',
		sort_cat: ''
	},
	computed: {
		prop_fulllist: function () { //every prop organised by category, in an array
			return [].concat.apply([], Object.values(prop_cats));
		},
		prop_catbounds: function () { //first prop of every category so we know where to draw borders
			return [].concat.apply([], Object.values(prop_cats).map(a => a[0]));
		},
		colourset_class: function () { //helper for classing main with the current colourset
			var obj = {};
			obj["cs_" + this.colourset] = true;
			return obj;
		}
	},
	methods: {
		sizePropCat: function (cat) { //how big should this category header be
			return {gridColumn: "span " + prop_cats[cat].length};
		},
		doPropBorder: function (prop) { //determine whether or not to draw a category border here
			return {propborderhere: this.prop_catbounds.includes(prop)};
		},
		sortStyleClass: function (prop) { //style prop name based on sort type
			if (this.sort_cat == prop) return this.sort_ord === 'asc' ? {'bad':true} : {'good':true}
			else return {};
		},
		sort: function (category) {
			if (category === 'default') {
				this.sort_cat = 'originalIndex';
				this.sort_ord = 'asc';
			} else if (this.sort_cat === category) {
				this.sort_ord === 'asc' ? this.sort_ord = 'dsc' : this.sort_ord = 'asc';
			} else {
				this.sort_cat = category;
				this.sort_ord = 'dsc';
			}

			var sortProps = (a, b) => b.props[this.sort_cat] - a.props[this.sort_cat]; //i'm going to put .sort in The Hole

			if (this.sort_ord === 'dsc') {
				this.teams[this.selected_team].lineup.sort(sortProps);
				this.teams[this.selected_team].rotation.sort(sortProps);
			} else {
				this.teams[this.selected_team].lineup.sort((a, b) => sortProps(b, a));
				this.teams[this.selected_team].rotation.sort((a, b) => sortProps(b, a));
			}
		}
	}
});

function stars(e, isBatter) { //thank u SIBR
	var coeff = 0;
	if (isBatter) {
		coeff = Math.pow(1 - e.tragicness, .01) * Math.pow(e.buoyancy, 0) * Math.pow(e.thwackability, .35) * Math.pow(e.moxie, .075) * Math.pow(e.divinity, .35) * Math.pow(e.musclitude, .075) * Math.pow(1 - e.patheticism, .05) * Math.pow(e.martyrdom, .02)
	} else {
		coeff = Math.pow(e.shakespearianism, .1) * Math.pow(e.suppression, 0) * Math.pow(e.unthwackability, .5) * Math.pow(e.coldness, .025) * Math.pow(e.overpowerment, .15) * Math.pow(e.ruthlessness, .4)
	}
	return Math.round(coeff * 10)/2
}

function getPlayers(ids, isBatter) {
	return fetch(url.players + ids.join(","))
	  .then(function(response) {
	   	return response.json()

	}).then(function(players) {
		var new_players = [];
		var i = 0;
		for (const player of players) {
			var new_player = {
				name: player.name,
				props: {originalIndex: i++}, //return current i then increment
				batter: isBatter,
				stars: stars(player, isBatter),
				batName: player.bat
			};
			for (prop of Object.keys(player)) {
				if (!prop_flags.exclude.includes(prop)) {
					new_player.props[prop] = player[prop]
				}
			};

			new_players.push(new_player);
		};
		return new_players

	}).catch(function(e) {console.warn("couldn't get players, error:", e )})
}

async function getTeam(team) {
	var t = {
		name: team.fullName,
		color1 : team.mainColor,
		color2 : team.secondaryColor,
		icon: String.fromCodePoint(Number(team.emoji)),
		slogan: team.slogan,
		lineup: [],
		rotation: []
	};
	t.lineup = await getPlayers(team.lineup, true);
	t.rotation = await getPlayers(team.rotation, false);
	return t
}

fetch(url.teams)
  .then(function(response) {
  	return response.json();

}).then(function(response) {
  	for (const team of response) {
    	getTeam(team).then(t => app.teams.push(t))
    	 .catch(function(e) {
			console.warn("couldn't get team, error:", e );
			app.team_load_fails += 1;
		})
	}

}).catch(function(e) {
	console.warn("couldn't get teams, error:", e );
	app.failed_teams = true;
})