const fs = require("fs");

module.exports = (client) => {
  client.logger.debug("Called handlers/component.js");
  const loadedComponents = [];

  fs.readdirSync("./components/", { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .forEach((dir) => {
      fs.readdirSync(`./components/${dir}/`)
        .filter((file) => file.endsWith(".js") && !file.startsWith("#"))
        .forEach((file) => {
          const component = require(`../components/${dir}/${file}`);
          if (component) {
            client[dir].set(component.name, component);
            loadedComponents.push(`${dir}/${component.name}`);
            client.logger.info(`Loaded component: ${dir}/${component.name}`);
          }
        });
    });

  console.log(`Loaded components: \n    ${loadedComponents.join("\n    ")}`);
};
