function make_character () {
    sprite_player = sprites.create(assets.image`character_front`, SpriteKind.Player)
    animate_character()
    sprite_player.setFlag(SpriteFlag.StayInScreen, true)
    controller.moveSprite(sprite_player, 80, 80)
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
let sprite_player: Sprite = null
scene.setBackgroundColor(7)
make_character()
