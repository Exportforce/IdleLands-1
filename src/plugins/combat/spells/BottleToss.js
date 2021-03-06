
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

export class BottleToss extends Spell {
  static element = SpellType.DEBUFF;
  static stat = 'special';
  static tiers = [
    { name: 'bottle toss',    spellPower: 1,  weight: 25, cost: 0,   profession: 'Pirate', level: 1 }
  ];

  static shouldCast(caster) {
    return caster.special > 9;
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const drunkMultiplier = this.caster.$personalities && this.caster.$personalities.isActive('Drunk') ? 2 : 1;
    const bottlesBonus = (this.caster._special.asPercent()/100) * this.caster.liveStats.con;
    const min = (bottlesBonus + this.caster.liveStats.str) * 0.35 * drunkMultiplier;
    const max = (bottlesBonus + this.caster.liveStats.str) * 1.15 * drunkMultiplier;
    return this.minMax(min, max) * this.spellPower;
  }

  preCast() {
    const message = '%player begins singing "99 bottles of ale on the wall..."!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        targets: [target]
      });

      while(this.caster.special > 9 && Spell.chance.bool({ likelihood: 75 })) {
        super.cast({
          damage: this.calcDamage(),
          message: '%player threw 9 bottles at %targetName, dealing %damage damage!',
          targets: [target]
        });
        this.caster._special.sub(9);
      }
    });
  }
}