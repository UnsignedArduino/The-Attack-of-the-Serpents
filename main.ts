namespace SpriteKind {
    export const Thing = SpriteKind.create()
    export const Villager = SpriteKind.create()
}
function house_walls_around (column: number, row: number) {
    tiles.setWallAt(tiles.getTileLocation(column - 1, row - 1), true)
    tiles.setWallAt(tiles.getTileLocation(column, row - 1), true)
    tiles.setWallAt(tiles.getTileLocation(column + 1, row - 1), true)
    tiles.setWallAt(tiles.getTileLocation(column - 1, row), true)
    tiles.setWallAt(tiles.getTileLocation(column, row), true)
    tiles.setWallAt(tiles.getTileLocation(column + 1, row), true)
    tiles.setWallAt(tiles.getTileLocation(column - 1, row + 1), true)
    tiles.setWallAt(tiles.getTileLocation(column + 1, row + 1), true)
}
function place_thing (image2: Image, column: number, row: number) {
    sprite_thing = sprites.create(image2, SpriteKind.Thing)
    sprite_thing.setFlag(SpriteFlag.Ghost, true)
    tiles.placeOnTile(sprite_thing, tiles.getTileLocation(column, row))
    tiles.setTileAt(tiles.getTileLocation(column, row), get_relative_ground_tile(column, row))
    tiles.setWallAt(tiles.getTileLocation(column, row), true)
}
function get_relative_ground_tile (column: number, row: number) {
    for (let direction of [CollisionDirection.Top, CollisionDirection.Right, CollisionDirection.Bottom, CollisionDirection.Left]) {
        if (tiles.tileIs(tiles.locationInDirection(tiles.getTileLocation(column, row), direction), assets.tile`grass`)) {
            return assets.tile`grass`
        } else if (tiles.tileIs(tiles.locationInDirection(tiles.getTileLocation(column, row), direction), assets.tile`dark_grass`)) {
            return assets.tile`dark_grass`
        }
    }
    return assets.tile`grass`
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (can_skip_dialog) {
        story.clearAllText()
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player) {
        use_sword()
    }
})
function fade_out (block: boolean) {
    color.startFade(color.Black, color.originalPalette, 2000)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function fade_in (block: boolean) {
    color.startFade(color.originalPalette, color.Black, 2000)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function place_floor_thing (image2: Image, column: number, row: number) {
    sprite_thing = sprites.create(image2, SpriteKind.Thing)
    sprite_thing.setFlag(SpriteFlag.Ghost, true)
    tiles.placeOnTile(sprite_thing, tiles.getTileLocation(column, row))
    tiles.setTileAt(tiles.getTileLocation(column, row), get_relative_ground_tile(column, row))
}
function make_villager () {
    villager_down_animations = [assets.animation`villager_1_walk_down`, assets.animation`villager_2_walk_down`, assets.animation`villager_3_walk_down`]
    villager_up_animations = [assets.animation`villager_1_walk_up`, assets.animation`villager_2_walk_up`, assets.animation`villager_3_walk_up`]
    villager_right_animations = [assets.animation`villager_1_walk_right`, assets.animation`villager_2_walk_right`, assets.animation`villager_3_walk_right`]
    villager_left_animations = [assets.animation`villager_1_walk_left`, assets.animation`villager_2_walk_left`, assets.animation`villager_3_walk_left`]
    villager_index = randint(0, villager_down_animations.length - 1)
    sprite_villager = sprites.create(villager_down_animations[0][0], SpriteKind.Villager)
    character.loopFrames(
    sprite_villager,
    villager_up_animations[villager_index],
    100,
    character.rule(Predicate.MovingUp)
    )
    character.loopFrames(
    sprite_villager,
    villager_right_animations[villager_index],
    100,
    character.rule(Predicate.MovingRight)
    )
    character.loopFrames(
    sprite_villager,
    villager_down_animations[villager_index],
    100,
    character.rule(Predicate.MovingDown)
    )
    character.loopFrames(
    sprite_villager,
    villager_left_animations[villager_index],
    100,
    character.rule(Predicate.MovingLeft)
    )
    character.runFrames(
    sprite_villager,
    [villager_up_animations[villager_index][0]],
    100,
    character.rule(Predicate.FacingUp)
    )
    character.runFrames(
    sprite_villager,
    [villager_right_animations[villager_index][0]],
    100,
    character.rule(Predicate.FacingRight)
    )
    character.runFrames(
    sprite_villager,
    [villager_down_animations[villager_index][0]],
    100,
    character.rule(Predicate.FacingDown)
    )
    character.runFrames(
    sprite_villager,
    [villager_left_animations[villager_index][0]],
    100,
    character.rule(Predicate.FacingLeft)
    )
    character.setCharacterAnimationsEnabled(sprite_villager, true)
    // can be:
    // - idle
    // - walking (to somewhere)
    // - panicking (to global target when under invasion)
    sprites.setDataString(sprite_villager, "state", "idle")
    tiles.placeOnRandomTile(sprite_villager, random_path_tile())
}
function make_character () {
    sprite_player = sprites.create(assets.image`character_front`, SpriteKind.Player)
    animate_character()
    sprites.setDataBoolean(sprite_player, "attacking", false)
    sprite_player.setFlag(SpriteFlag.StayInScreen, true)
    controller.moveSprite(sprite_player, 80, 80)
    scene.cameraFollowSprite(sprite_player)
}
function use_sword () {
    timer.throttle("attack", 400, function () {
        sprites.setDataBoolean(sprite_player, "attacking", true)
        character.setCharacterAnimationsEnabled(sprite_player, false)
        if (character.matchesRule(sprite_player, character.rule(Predicate.FacingUp))) {
            animation.runImageAnimation(
            sprite_player,
            assets.animation`character_fight_up`,
            100,
            false
            )
        } else if (character.matchesRule(sprite_player, character.rule(Predicate.FacingDown))) {
            animation.runImageAnimation(
            sprite_player,
            assets.animation`character_fight_down`,
            100,
            false
            )
        } else if (character.matchesRule(sprite_player, character.rule(Predicate.FacingLeft))) {
            sprite_player.x += -4
            animation.runImageAnimation(
            sprite_player,
            assets.animation`character_fight_left`,
            100,
            false
            )
        } else if (character.matchesRule(sprite_player, character.rule(Predicate.FacingRight))) {
            animation.runImageAnimation(
            sprite_player,
            assets.animation`character_fight_right`,
            100,
            false
            )
        } else {
            sprites.setDataBoolean(sprite_player, "attacking", false)
            character.setCharacterAnimationsEnabled(sprite_player, true)
        }
        timer.after(400, function () {
            sprites.setDataBoolean(sprite_player, "attacking", false)
            character.setCharacterAnimationsEnabled(sprite_player, true)
        })
    })
}
function make_tilemap () {
    scene.setBackgroundColor(7)
    tiles.setTilemap(tilemap`level_1`)
    for (let location of tiles.getTilesByType(sprites.castle.rock0)) {
        tiles.setWallAt(location, true)
    }
    for (let location of tiles.getTilesByType(sprites.castle.rock1)) {
        tiles.setWallAt(location, true)
    }
    for (let location of tiles.getTilesByType(assets.tile`water`)) {
        tiles.setWallAt(location, true)
    }
    for (let location of tiles.getTilesByType(assets.tile`tree_1`)) {
        place_thing(assets.image`tree_1`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        sprite_thing.y += -8
    }
    for (let location of tiles.getTilesByType(assets.tile`tree_2`)) {
        place_thing(assets.image`tree_2`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        sprite_thing.y += -8
    }
    for (let location of tiles.getTilesByType(assets.tile`tree_3`)) {
        place_thing(assets.image`tree_3`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        sprite_thing.y += -8
    }
    for (let location of tiles.getTilesByType(assets.tile`tree_4`)) {
        place_thing(assets.image`tree_4`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        sprite_thing.y += -4
    }
    for (let location of tiles.getTilesByType(assets.tile`tree_4`)) {
        place_thing(assets.image`tree_4`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        sprite_thing.y += -4
    }
    for (let location of tiles.getTilesByType(assets.tile`flower_1`)) {
        place_floor_thing(assets.image`flower_1`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
    }
    for (let location of tiles.getTilesByType(assets.tile`flower_2`)) {
        place_floor_thing(assets.image`flower_2`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
    }
    for (let location of tiles.getTilesByType(assets.tile`mushroom_1`)) {
        place_floor_thing(assets.image`mushroom_1`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
    }
    for (let location of tiles.getTilesByType(assets.tile`stump_1`)) {
        place_thing(assets.image`stump_1`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
    }
    for (let location of tiles.getTilesByType(assets.tile`house_1`)) {
        place_thing(assets.image`house_1`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        house_walls_around(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
    }
    for (let location of tiles.getTilesByType(assets.tile`house_2`)) {
        place_thing(assets.image`house_2`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        house_walls_around(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
    }
}
function animate_character () {
    character.loopFrames(
    sprite_player,
    assets.animation`character_walk_up`,
    100,
    character.rule(Predicate.MovingUp)
    )
    character.loopFrames(
    sprite_player,
    assets.animation`character_walk_right`,
    100,
    character.rule(Predicate.MovingRight)
    )
    character.loopFrames(
    sprite_player,
    assets.animation`character_walk_down`,
    100,
    character.rule(Predicate.MovingDown)
    )
    character.loopFrames(
    sprite_player,
    assets.animation`character_walk_left`,
    100,
    character.rule(Predicate.MovingLeft)
    )
    character.runFrames(
    sprite_player,
    assets.animation`character_up`,
    100,
    character.rule(Predicate.NotMoving, Predicate.FacingUp)
    )
    character.runFrames(
    sprite_player,
    assets.animation`character_right`,
    100,
    character.rule(Predicate.NotMoving, Predicate.FacingRight)
    )
    character.runFrames(
    sprite_player,
    assets.animation`character_down`,
    100,
    character.rule(Predicate.NotMoving, Predicate.FacingDown)
    )
    character.runFrames(
    sprite_player,
    assets.animation`character_left`,
    100,
    character.rule(Predicate.NotMoving, Predicate.FacingLeft)
    )
}
function random_path_tile () {
    return [
    sprites.castle.tilePath5,
    sprites.castle.tilePath1,
    sprites.castle.tilePath2,
    sprites.castle.tilePath3,
    sprites.castle.tilePath8,
    sprites.castle.tilePath9,
    sprites.castle.tilePath4,
    sprites.castle.tilePath7,
    sprites.castle.tilePath6
    ]._pickRandom()
}
let sprite_villager: Sprite = null
let villager_index = 0
let villager_left_animations: Image[][] = []
let villager_right_animations: Image[][] = []
let villager_up_animations: Image[][] = []
let villager_down_animations: Image[][] = []
let sprite_thing: Sprite = null
let sprite_player: Sprite = null
let can_skip_dialog = false
color.setPalette(
color.Black
)
can_skip_dialog = false
pause(100)
if (controller.B.isPressed()) {
    scene.setBackgroundColor(12)
    fade_out(false)
    story.showPlayerChoices("Reset everything!", "No keep my data!")
    if (story.getLastAnswer().includes("Reset")) {
        blockSettings.clear()
        story.printCharacterText("Reset successful.")
        fade_in(true)
        game.reset()
    } else {
        story.printCharacterText("No reset was performed.")
        fade_in(true)
    }
}
if (!(blockSettings.exists("name"))) {
    scene.setBackgroundColor(12)
    fade_out(true)
    blockSettings.writeString("name", game.askForString("Please input a name: ", 24))
    fade_in(true)
}
let name = blockSettings.readString("name")
can_skip_dialog = true
make_character()
make_tilemap()
tiles.placeOnTile(sprite_player, tiles.getTileLocation(17, 18))
sprite_player.y += tiles.tileWidth() / 2
sprite_player.x += tiles.tileWidth() / 2
for (let index = 0; index < 20; index++) {
    make_villager()
}
pause(100)
fade_out(false)
game.onUpdate(function () {
    for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
        sprite.z = sprite.bottom - 8
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Enemy)) {
        sprite.z = sprite.bottom
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Thing)) {
        sprite.z = sprite.bottom
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Villager)) {
        sprite.z = sprite.bottom
    }
})
forever(function () {
    for (let sprite_villager of sprites.allOfKind(SpriteKind.Villager)) {
        if (sprites.readDataString(sprite_villager, "state") == "panicking") {
            continue;
        }
        if (sprites.readDataString(sprite_villager, "state") == "idle") {
            if (Math.percentChance(50)) {
                sprites.setDataString(sprite_villager, "state", "walking")
                scene.followPath(sprite_villager, scene.aStar(tiles.locationOfSprite(sprite_villager), tiles.getTilesByType(random_path_tile())._pickRandom()), 50)
            }
        } else {
            if (!(character.matchesRule(sprite_villager, character.rule(Predicate.Moving)))) {
                sprites.setDataString(sprite_villager, "state", "idle")
            }
        }
        pause(randint(100, 500))
    }
})
