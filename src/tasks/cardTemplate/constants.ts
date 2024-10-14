import config from '@/config';

const wikiApiUrl = 'https://wiki.mushureport.com/api.php';

const mainUsername = config.wiki.botUsername.replace(/@.*$/, '');

const userAgent = `card-template-content-update-bot/0.0.0 (${config.wiki.botUsername}; [[User:${mainUsername}]]) node.js`;

export { userAgent, wikiApiUrl };
