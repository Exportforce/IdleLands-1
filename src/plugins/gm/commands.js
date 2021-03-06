

export class GMCommands {
  static teleport(player, { map, x, y, toLoc }) {
    const tileData = {
      object: {
        properties: {
          destx: x,
          desty: y,
          movementType: 'teleport',
          map,
          toLoc
        }
      }
    };

    player.$playerMovement.handleTileTeleport(player, tileData, true);
  }

  static toggleMod(player) {
    player.isMod = !player.isMod;
    player.save();
  }

  static toggleAchievement(player, achievement) {
    player.permanentAchievements = player.permanentAchievements || {};
    player.permanentAchievements[achievement] = !player.permanentAchievements[achievement];
  }
}