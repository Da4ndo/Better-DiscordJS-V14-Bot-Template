const client = require('..');
const fs = require('fs');
const path = require("path");
const language = {};

fs.readdirSync(`./language/`).filter(file => file.endsWith('.json') && !file.startsWith('#')).forEach((file) => {
    eval(`language.${file.replace(/\.json/, '')}`+` = require('../language/${file}')`);
});

module.exports = (index, lang='en', replace=[]) => {
    client.logger.debug(`Called lang.js <= (${index}, ${replace})`);
    const indexes = index.split(':');

    try {
        var str = language[lang][indexes[0]];
        indexes.splice(0, 1);
    } catch (e) {
        client.logger.error(e);
        client.logger.info('This error propably caused by incorrectly passed arguments to lang function.');
        client.logger.debug(`Passed arguments: index:${index}, lang:${lang}, replace:${replace}.`);
        console.log(e);
        console.log('This error propably caused by incorrectly passed arguments to lang function.');
        console.log(`Passed arguments: index:${index}, lang:${lang}, replace:${replace}.`);
        return 'Language Managment Error';
    }

    try {
        indexes.forEach(element => {
            str = str[element];
        });

        for(var i = 0; i < replace.length; i++) {
            str = str.replace(`{${i}}`, replace[i]);
        }
    } catch(e) {
        client.logger.error(e);
    
        if (e instanceof TypeError) {
            const _e = new Error();
            const regex = /\((.*):(\d+):(\d+)\)$/;
            const match = regex.exec(_e.stack.split("\n")[2]);
            var filepath = match[1].split(path.sep).pop();
            var line = match[2];
            console.log(`[!] Languege Managment Error at ${filepath}:${line}: Passed arguments: index:${index}, lang:${lang}, replace:${replace}.`);
            return 'Language Managment Error';
        }
    }
    return str;
}