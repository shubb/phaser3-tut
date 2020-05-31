import Phaser from 'phaser'

const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const STAR_KEY  = 'stars'
const BOMB_KEY = 'bomb'

export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
        super('hello-world')
        
        this.player = undefined
        this.cursors = undefined

        this.speed = 0
	}

	preload()
    {
        this.load.image('sky', 'assets/sky.png')
        this.load.image(BOMB_KEY, 'assets/bomb.png')
        this.load.image(STAR_KEY, 'assets/star.png')
        this.load.image(GROUND_KEY, 'assets/platform.png')

        this.load.spritesheet(DUDE_KEY, 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        )
    }

    create()
    {
        this.add.image(400, 300, 'sky')

        const platforms = this.createPlatforms()
        this.player = this.createPlayer()
        const stars = this.createStars()
        
        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(stars, platforms)
        
        this.physics.add.overlap(this.player, stars, this.collectStar, null, this)

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    collectStar(player, star)
    {
        star.disableBody(true, true)
    }

    createPlatforms()
    {
        const platforms = this.physics.add.staticGroup()

        platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()

        platforms.create(600,400, GROUND_KEY)
        platforms.create(50,250, GROUND_KEY)
        platforms.create(750,220, GROUND_KEY)

        return platforms
    }

    createPlayer()
    {
        const player = this.physics.add.sprite(100, 450, DUDE_KEY)
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, {start: 0, end:3 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'turn',
            frames: [ { key: DUDE_KEY, frame: 4} ],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        })

        return player
    }

    createStars()
    {
        const stars = this.physics.add.group({
            key: STAR_KEY,
            repeat: 11,
            setXY: { x:12, y:0, stepX: 70 }
        })

        stars.children.iterate((child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        }))

        return stars
    }

    update()
    {
        if(this.cursors.left.isDown)
        {
            this.speed = Math.min(-30, this.speed - 10)
            this.player.anims.play('left', true)
        }
        else if(this.cursors.right.isDown)
        {
            this.speed = Math.max(30, this.speed + 10)
            this.player.anims.play('right', true)
        }
        else
        {
            this.speed = 0
            this.player.anims.play('turn', true)
        }
        this.player.setVelocityX(this.speed)

        if(this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330)
        }
    }

}

