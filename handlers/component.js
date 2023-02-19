const fs = require('fs');

module.exports = (client) => {
	client.logger.debug(`Called handlers/component.js`);
	var loaded_components = [];
	fs.readdirSync('./components/', { withFileTypes: true }).filter((item) => item.isDirectory()).map((item) => item.name).forEach(dir => {
		fs.readdirSync(`./components/${dir}/`).filter(file => file.endsWith('.js') && !file.startsWith('#')).forEach((file) => {
			let component = require(`../components/${dir}/${file}`)
			if(component) {
				client[dir].set(component.name, component)

				loaded_components.push(`${dir}/${component.name}`);
				client.logger.info(`Loaded component: ${dir}/${component.name}`);
			}
		});
	});
	console.log(`Loaded components: \n    ${loaded_components.join('\n    ')}`);
};
