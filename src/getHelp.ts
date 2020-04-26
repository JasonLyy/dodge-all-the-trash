import { MessageEmbed } from 'discord.js';

const getHelp = (): MessageEmbed => {
    return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Commands')
        .addFields({ name: '!add [player name]', value: 'E.g. !add TrungT' })
        .addFields({ name: '!add [player name] ["comments"]', value: 'E.g. !add TrungT "abosolute garbage"' })
        .addFields({ name: '!check [player name]', value: 'E.g. !check TrungT' })
        .addFields({
            name: '!check [champion select text]',
            value:
                'E.g. !check MrAznJzn joined the lobby\nJalapeno joined the lobby\nSteel Tempest joined the lobby\nsongbao joined the lobby\nRiven Uce joined the lobby',
        })
        .addFields({ name: '!help', value: 'E.g. !help' })
        .addFields({ name: '!list', value: 'E.g. !list' });
};

export default getHelp;
