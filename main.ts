namespace SpriteKind {
    export const Thing = SpriteKind.create()
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
let sprite_thing: Sprite = null
let sprite_player: Sprite = null
color.setPalette(
color.Black
)
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
make_character()
make_tilemap()
tiles.placeOnTile(sprite_player, tiles.getTileLocation(17, 18))
sprite_player.y += tiles.tileWidth() / 2
sprite_player.x += tiles.tileWidth() / 2
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
})
