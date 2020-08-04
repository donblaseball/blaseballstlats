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