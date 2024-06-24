import r from 'raylib'
import resources from '../game_resources.js'
import config from '../game_config.js'

export default class LevelUpUI {
    update() {

    }

    render() {
        const spriteSource = {
            x: 192,
            y: 96,
            width: 64,
            height: 64
        }

        const width = 140;
        const height = width;
        const x = config.WIDTH / 2 - (width / 2)
        const y = config.HEIGHT / 2 - (height / 2)


        r.DrawTexturePro(
            resources.uispritesheet, 
            spriteSource, { 
                x,
                y,
                width,
                height,
            },
            r.Vector2(0,0), 0, r.WHITE)
        
        // const margin = 10;
        // const options = [
        //     'Level up tower',
        //     'Level up tower',
        //     'Add new tower',
        // ];
        // options.forEach((element, i) => {
        //     const optionX = x + margin
        //     const optionY = y + (height / options.length) * i

        //     r.DrawTexturePro(
        //         resources.uispritesheet, 
        //         {
        //             x: 192,
        //             y: 96,
        //             width: 64,
        //             height: 64,
        //         }, { 
        //             x: optionX,
        //             y: optionY,
        //             width: width - margin * 2,
        //             height: 30,
        //         },
        //         r.Vector2(0,0), 0, r.WHITE)

            // r.DrawTexturePro(
            //     resources.uispritesheet, 
            //     {
            //         x: 353,
            //         y: 97,
            //         width: 14,
            //         height: 14,
            //     }, { 
            //         x: config.WIDTH / 2,
            //         y: config.HEIGHT / 2,
            //         width: 12,
            //         height: 12,
            //     },
            //     r.Vector2(0,0), 0, r.WHITE)
        // });
    }
}