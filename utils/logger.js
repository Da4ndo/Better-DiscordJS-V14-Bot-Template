const moment = require("moment");
const fs = require("fs");
const path = require("path");

class Logger {
  constructor(
    logfile,
    format = "%(asctime)s-%(filename)s:%(lineno)s %(levelname)s %(message)s",
    datefmt = "Y-M-D h:mm:ss"
  ) {
    this.logfile = logfile;
    this.format = format;
    this.datefmt = datefmt;
  }

  init = () => {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(path.dirname(this.logfile)))
        fs.mkdirSync(path.dirname(this.logfile), { recursive: true });
      fs.exists(this.logfile, (exists) => {
        if (exists) {
          fs.appendFile(
            this.logfile,
            "\n\n======================= Starting Log (" +
              moment().format("YYYY-MM-DD h:mm:ss") +
              ") =======================\n",
            () => {}
          );
        } else {
          fs.writeFile(
            this.logfile,
            "======================= Starting Log (" +
              moment().format("YYYY-MM-DD h:mm:ss") +
              ") =======================\n",
            () => {}
          );
        }
        this.fstream = fs.createWriteStream(this.logfile, { flags: "a" });
        resolve("Logger initialized");
      });
    });
  };

  info(message) {
    const e = new Error();
    const est = e.stack ? e.stack.split("\n")[2] : '';
    var filepath = est.split(path.sep).pop().split(":").shift();
    var line = est.split(path.sep).pop().split(":")[1];

    this.fstream.write(
      this.format
        .replace("%(asctime)s", moment().format(this.datefmt))
        .replace("%(filename)s", filepath)
        .replace("%(lineno)s", line)
        .replace("%(levelname)s", "INFO")
        .replace("%(message)s", message) + "\n"
    );
  }

  debug(message) {
    const e = new Error();
    const est = e.stack ? e.stack.split("\n")[2] : '';
    var filepath = est.split(path.sep).pop().split(":").shift();
    var line = est.split(path.sep).pop().split(":")[1];

    this.fstream.write(
      this.format
        .replace("%(asctime)s", moment().format(this.datefmt))
        .replace("%(filename)s", filepath)
        .replace("%(lineno)s", line)
        .replace("%(levelname)s", "DEBUG")
        .replace("%(message)s", message) + "\n"
    );
  }

  error(message) {
    const e = new Error();
    const est = e.stack ? e.stack.split("\n")[2] : '';
    var filepath = est.split(path.sep).pop().split(":").shift();
    var line = est.split(path.sep).pop().split(":")[1];

    this.fstream.write(
      this.format
        .replace("%(asctime)s", moment().format(this.datefmt))
        .replace("%(filename)s", filepath)
        .replace("%(lineno)s", line)
        .replace("%(levelname)s", "ERROR")
        .replace("%(message)s", message) + "\n"
    );
  }

  warn(message) {
    const e = new Error();
    const est = e.stack ? e.stack.split("\n")[2] : '';
    var filepath = est.split(path.sep).pop().split(":").shift();
    var line = est.split(path.sep).pop().split(":")[1];

    this.fstream.write(
      this.format
        .replace("%(asctime)s", moment().format(this.datefmt))
        .replace("%(filename)s", filepath)
        .replace("%(lineno)s", line)
        .replace("%(levelname)s", "WARN")
        .replace("%(message)s", message) + "\n"
    );
  }

  end_fstream() {
    this.fstream.end();
  }
}

module.exports = Logger;
