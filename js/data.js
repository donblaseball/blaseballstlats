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