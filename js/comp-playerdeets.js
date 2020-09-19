Vue.component("player-deets", {
  props: ["player"],
  //data: function () {return {console: console}},
  template: `
		<div class="player" @click='$emit("update-player", {id: player.id, isBatter: player.batter})'>
			<span class="name">
				<span class="customBat" v-if="player.batName != ''" :title="player.batName">🏏</span>
				{{player.name}} 
				{{player.stars}}*
			</span>
			<span class="prop" :class="[divineProp(player.props[prop], prop), doPropBorder(prop)]" v-for="prop in this.$root.prop_fulllist">
				{{roundNicely(player.props[prop])}}
			</span>
		</div>
	`,
  methods: {
    doPropBorder: function (prop) {
      //proxy
      return this.$root.doPropBorder(prop);
    },
    roundNicely: function (prop) {
      //disdplay a prop nice and good
      if (typeof prop == "boolean") return prop ? "yes" : "no";
      else if (prop == Math.round(prop)) return prop;
      else if (!prop) return "undef";
      else return Number(prop).toFixed(3);
    },
    divineProp: function (propv, propName) {
      var prop = propv;
      //console.log(propName, prop)
      if (prop_flags.bad.includes(propName)) prop = 1 - propv; //prop is negative, low prop is good

      if (typeof prop == "boolean") return prop ? { bad: true } : "";
      //all bools are negative so far
      else if (prop_flags.dontRate.includes(propName)) return "";
      //fuck knows what this is lmfao
      else if (propName === "totalFingers") {
        //fingers, 10 is normal everything else is good
        if (prop == 10) return "";
        else return { good: true };
      } else if (propName === "tragicness") {
        //tragicness is bad if not base_tragicness but fine if it is
        if (prop > base_tragicness) return { bad: true };
        else if (prop == base_tragicness) return "";
        else return { great: true };
      } else if (prop > 0.9) return { great: true };
      //normal rules
      else if (prop > 0.7) return { good: true };
      else if (prop > 0.4) return { ok: true };
      else return { bad: true };
    },
    getPlayer: async (id) => {
      let ret = await fetch(
        `https://api.blaseball-reference.com/v1/playerInfo?playerId=${id}&all=true`
      );
      return await ret.json();
    },
  },
});
