/*Old defs, here for posterity

const prop_names = ["anticapitalism", "baseThirst", "buoyancy", "chasiness", "cinnamon", "coldness", "continuation", 
				"deceased", "divinity", "fate", "groundFriction", "indulgence", "laserlikeness", "martyrdom", "moxie", "musclitude", 
				"omniscience", "overpowerment", "patheticism", "peanutAllergy", "pressurization", "ruthlessness", "shakespearianism", 
				"soul", "suppression", "tenaciousness", "thwackability", "totalFingers", "tragicness", "unthwackability", "watchfulness"]; //properties
const prop_abbvr = ["anticap", "thrst", "float", "chase", "cinnm", "cold", "cont", 
			"dead", "divin", "fate", "fric", "indlg", "laser", "martyr", "moxie", "muscl", 
			"omnisc", "op", "pathtc", "allergy", "prssr", "ruth", "ssper", 
			"soul", "supp", "tenac", "thwack", "fingers", "tragic", "unthwk", "watch"]; //the abbreviations. respective, order must be maintained.
const prop_negative = ["patheticism"]; //very bad dislike having this
const prop_bool = ["deceased", "peanutAllergy"]; //currently all bools are also negative. this could be solved with a typeof()==boolean but this is here for uniformity™ 
const prop_banned = ["_id", "name", "bat"]; //very bad stat no good do not include
const prop_nodivine = ["fate", "soul"]; //don't divine this
const base_tragicness = 0.1; //tragicness went up in season 3 so this is here if it goes up again
*/

//New defs
const prop_cats = {
	baserunning: ["baseThirst", "continuation", "groundFriction", "indulgence", "laserlikeness"],
    defense: ["anticapitalism", "chasiness", "omniscience", "tenaciousness", "watchfulness"],
    hitting: ["buoyancy", "divinity", "martyrdom", "moxie", "musclitude", "patheticism", "thwackability", "tragicness"],
    pitching: ["coldness", "overpowerment", "ruthlessness", "shakespearianism", "suppression", "unthwackability", "totalFingers"],
    extras: ["cinnamon", "deceased", "fate", "peanutAllergy", "pressurization", "soul"]
};
//good luck maintaining this! (actually just add new ones on the end)
const abbreviations = {
	anticapitalism: "anticap", baseThirst: "thrst", buoyancy: "float", chasiness: "chase", cinnamon: "cinnm", coldness: "cold", 
	continuation: "cont", deceased: "dead", divinity: "divin", fate: "fate", groundFriction: "fric", indulgence: "indlg", laserlikeness: "laser", 
	martyrdom: "martyr", moxie: "moxie", musclitude: "muscl", omniscience: "omnisc", overpowerment: "op", patheticism: "pathtc", peanutAllergy: "allergy",
	pressurization: "prssr", ruthlessness: "ruth", shakespearianism: "ssper", soul: "soul", suppression: "supp", tenaciousness: "tenac", thwackability: "thwack", 
	totalFingers: "fingers", tragicness: "tragic", unthwackability: "unthwk", watchfulness: "watch"
};
const prop_flags = {
	exclude: ["_id", "name", "bat"], //do not store these in player.props
	dontRate: ["cinnamon", "fate", "soul", "pressurization"], //do not colour-divine these
	bad: ["patheticism"] //invert these before rating
};
const base_tragicness = 0.1; //tragicness went up in season 3 so this is here if it goes up again

const url_prefix = "https://blaseballcors.herokuapp.com/"
const url = {
	players: url_prefix + "https://blaseball.com/database/players?ids=",
	teams: url_prefix + "https://blaseball.com/database/allTeams"
}