controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    use_sword()
})
function make_character () {
    sprite_player = sprites.create(assets.image`character_front`, SpriteKind.Player)
    animate_character()
    sprites.setDataBoolean(sprite_player, "attacking", false)
    sprite_player.setFlag(SpriteFlag.StayInScreen, true)
    controller.moveSprite(sprite_player, 80, 80)
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
