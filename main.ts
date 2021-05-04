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
function part_1_1 () {
    fade_out(false)
    color.pauseUntilFadeDone()
    can_skip_dialog = true
    story.printCharacterText("Ah what a beautiful day.", name)
    story.printCharacterText("Now which house does the leader live in? That old man told me to meet him today.", name)
    story.printCharacterText("Doesn't he live in a blue house?", name)
    enable_movement(true)
    while (true) {
        sprite_overlapping = overlapping_sprite_kind(sprite_player, SpriteKind.Thing)
        if (sprite_overlapping) {
            if (sprites.readDataBoolean(sprite_overlapping, "is_house")) {
                enable_movement(false)
                story.printCharacterText("*knock knock knock*", name)
                timer.background(function () {
                    story.spriteMoveToLocation(sprite_player, sprite_player.x, sprite_player.y + tiles.tileWidth(), 80)
                    character.setCharacterState(sprite_leader, character.rule(Predicate.FacingUp))
                })
                if (sprites.readDataBoolean(sprite_overlapping, "has_leader")) {
                    break;
                } else {
                    story.printCharacterText("No one is home!", "*Muffled voice*")
                }
                enable_movement(true)
                character.clearCharacterState(sprite_player)
            }
        }
        pause(100)
    }
    sprite_leader = make_villager(3, false)
    tiles.placeOnTile(sprite_leader, tiles.locationInDirection(tiles.locationOfSprite(sprite_player), CollisionDirection.Top))
    story.spriteMoveToLocation(sprite_leader, sprite_leader.x, sprite_leader.y + tiles.tileWidth(), 50)
    character.setCharacterState(sprite_leader, character.rule(Predicate.FacingDown))
    pause(1000)
    story.printCharacterText("Ah, hello there " + name + ". Today's the day. Come on, we have much to discuss. Follow me.", "Village Leader")
    path = scene.aStar(tiles.locationOfSprite(sprite_leader), tiles.getTileLocation(16, 14))
    pause(500)
    scene.cameraFollowSprite(null)
    character.clearCharacterState(sprite_leader)
    scene.followPath(sprite_leader, path, 50)
    pause(500)
    scene.followPath(sprite_player, path, 50)
    fade_in(true)
    scene.cameraFollowSprite(sprite_player)
}
function place_thing (image2: Image, column: number, row: number) {
    place_floor_thing(image2, column, row)
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
function overlapping_sprite_kind (overlap_sprite: Sprite, kind: number) {
    for (let sprite of sprites.allOfKind(kind)) {
        if (overlap_sprite.overlapsWith(sprite)) {
            return sprite
        }
    }
    return [][0]
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player && enable_fighting) {
        use_sword()
    }
})
function part_1 () {
    if (current_part == "1.1") {
        part_1_1()
        save_part("1.2")
    }
}
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
    sprites.setDataBoolean(sprite_thing, "is_house", false)
    sprites.setDataBoolean(sprite_thing, "has_leader", false)
}
function make_villager (picture_index: number, do_wandering: boolean) {
    villager_down_animations = [assets.animation`villager_1_walk_down`, assets.animation`villager_2_walk_down`, assets.animation`villager_3_walk_down`, assets.animation`village_leader_walk_down`]
    villager_up_animations = [assets.animation`villager_1_walk_up`, assets.animation`villager_2_walk_up`, assets.animation`villager_3_walk_up`, assets.animation`villager_leader_walk_up`]
    villager_right_animations = [assets.animation`villager_1_walk_right`, assets.animation`villager_2_walk_right`, assets.animation`villager_3_walk_right`, assets.animation`villager_leader_walk_right`]
    villager_left_animations = [assets.animation`villager_1_walk_left`, assets.animation`villager_2_walk_left`, assets.animation`villager_3_walk_left`, assets.animation`village_leader_walk_left`]
    sprite_villager = sprites.create(villager_down_animations[picture_index][0], SpriteKind.Villager)
    character.loopFrames(
    sprite_villager,
    villager_up_animations[picture_index],
    100,
    character.rule(Predicate.MovingUp)
    )
    character.loopFrames(
    sprite_villager,
    villager_right_animations[picture_index],
    100,
    character.rule(Predicate.MovingRight)
    )
    character.loopFrames(
    sprite_villager,
    villager_down_animations[picture_index],
    100,
    character.rule(Predicate.MovingDown)
    )
    character.loopFrames(
    sprite_villager,
    villager_left_animations[picture_index],
    100,
    character.rule(Predicate.MovingLeft)
    )
    character.runFrames(
    sprite_villager,
    [villager_up_animations[picture_index][0]],
    100,
    character.rule(Predicate.FacingUp)
    )
    character.runFrames(
    sprite_villager,
    [villager_right_animations[picture_index][0]],
    100,
    character.rule(Predicate.FacingRight)
    )
    character.runFrames(
    sprite_villager,
    [villager_down_animations[picture_index][0]],
    100,
    character.rule(Predicate.FacingDown)
    )
    character.runFrames(
    sprite_villager,
    [villager_left_animations[picture_index][0]],
    100,
    character.rule(Predicate.FacingLeft)
    )
    character.setCharacterAnimationsEnabled(sprite_villager, true)
    // can be:
    // - idle
    // - walking (to somewhere)
    // - panicking (to global target when under invasion)
    sprites.setDataString(sprite_villager, "state", "idle")
    sprites.setDataBoolean(sprite_villager, "do_wandering", do_wandering)
    tiles.placeOnRandomTile(sprite_villager, random_path_tile())
    return sprite_villager
}
function enable_movement (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_player, 80, 80)
    } else {
        controller.moveSprite(sprite_player, 0, 0)
    }
}
function make_character () {
    sprite_player = sprites.create(assets.image`character_front`, SpriteKind.Player)
    animate_character()
    sprites.setDataBoolean(sprite_player, "attacking", false)
    sprite_player.setFlag(SpriteFlag.StayInScreen, true)
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
        sprites.setDataBoolean(sprite_thing, "is_house", true)
        sprite_thing.setFlag(SpriteFlag.GhostThroughSprites, false)
    }
    for (let location of tiles.getTilesByType(assets.tile`house_2`)) {
        place_thing(assets.image`house_2`, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        house_walls_around(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        sprites.setDataBoolean(sprite_thing, "is_house", true)
        sprite_thing.setFlag(SpriteFlag.GhostThroughSprites, false)
    }
    sprites.setDataBoolean(sprite_thing, "has_leader", true)
}
function save_part (part: string) {
    current_part = part
    blockSettings.writeString("part", current_part)
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
let villager_left_animations: Image[][] = []
let villager_right_animations: Image[][] = []
let villager_up_animations: Image[][] = []
let villager_down_animations: Image[][] = []
let sprite_thing: Sprite = null
let path: tiles.Location[] = []
let sprite_leader: Sprite = null
let sprite_overlapping: Sprite = null
let sprite_player: Sprite = null
let current_part = ""
let name = ""
let enable_fighting = false
let can_skip_dialog = false
color.setPalette(
color.Black
)
can_skip_dialog = false
enable_fighting = false
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
name = blockSettings.readString("name")
if (!(blockSettings.exists("part"))) {
    blockSettings.writeString("part", "1.1")
}
current_part = blockSettings.readString("part")
can_skip_dialog = true
make_character()
make_tilemap()
tiles.placeOnTile(sprite_player, tiles.getTileLocation(17, 18))
sprite_player.y += tiles.tileWidth() / 2
sprite_player.x += tiles.tileWidth() / 2
for (let index = 0; index < 20; index++) {
    make_villager(randint(0, 2), true)
}
timer.background(function () {
    pause(100)
    part_1()
})
game.onUpdate(function () {
    for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
        sprite.z = (sprite.bottom - 8) / 100
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Enemy)) {
        sprite.z = sprite.bottom / 100
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Thing)) {
        sprite.z = sprite.bottom / 100
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Villager)) {
        sprite.z = sprite.bottom / 100
    }
})
forever(function () {
    for (let sprite_villager of sprites.allOfKind(SpriteKind.Villager)) {
        if (sprites.readDataString(sprite_villager, "state") == "panicking") {
            continue;
        }
        if (sprites.readDataString(sprite_villager, "state") == "idle") {
            if (Math.percentChance(50) && sprites.readDataBoolean(sprite_villager, "do_wandering")) {
                sprites.setDataString(sprite_villager, "state", "walking")
                scene.followPath(sprite_villager, scene.aStar(tiles.locationOfSprite(sprite_villager), tiles.getTilesByType(random_path_tile())._pickRandom()), 50)
            }
        } else {
            if (!(character.matchesRule(sprite_villager, character.rule(Predicate.Moving)))) {
                sprites.setDataString(sprite_villager, "state", "idle")
            }
        }
        pause(20)
    }
})
