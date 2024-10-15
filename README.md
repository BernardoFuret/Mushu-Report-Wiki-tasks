# Lorcana card updater

## Usage

### Running the script

1. Clone the repository or download the code as zip. After cloning or extracting the zip,
enter the project folder.
2. Open a command line interface in the project folder and run the `npm i` command
to install the dependencies.
3. Duplicate the file `.env.example` and rename the copy to `.env`.
4. Place the CSV file to be processed inside the `data` folder.
    * This file must be a valid CSV file.
    * The first column will be interpreted as the wiki pagenames to be edited. 
    * The first row will be considered as headers, where all but the first cell
    are names of the parameters to be updated.
    * Each cell, except from the first row and column will be the value to be
  inserted on the respective page.
5. Fill the `.env` file according to the [configuration section](#configuration) below.
6. On the command line interface, run the `npm start` command to start the script.

To run the script again just redo step 6 above, re-configuring as needed following
steps 4 and 5.

After running the script, a `logs` folder will be available with the collected
log messages. Each time the script is run, the log files are overwritten.


### Configuration

The project can be configured using an `.env` file.

An example `.env.example` file is provided. Duplicate it, rename it to `.env`.

The following environment variables are available:

* `DEBUG`: Optional variable. Enables logging more detailed messages. Expects
boolean values (if empty or not set, it is converted to `false`; `true` otherwise).
* `CSV_FILE_NAME`: Required variable. The name of the file (including the extension)
placed in the `data` folder to be processed.
* `WIKI_BOT_USERNAME`: Required variable. The username of the bot account.
* `WIKI_BOT_PASSWORD`: Required variable. The password of the bot account.
Retrieved via [Manual:Bot passwords](https://www.mediawiki.org/wiki/Manual:Bot_passwords)].


### Other commands

#### Linting

Run `npm run lint` to lint the code. Performs type checking with `tsc`, lints the code
via `eslint`.

Alternatively, each stage can be run separately: `npm run lint:types` and
`npm run lint:code`, respectively.

Run `npm run lint:code:fix` to fix linting errors that can be fixed automatically for code.


#### File cleaning

Run `clean:deps` to remove project dependencies (`node_modules` folder).

Run `clean:logs` to remove the collected logs (`logs` folder).


## See also
* [TODO list](TODO.md)
* [Mushu Report Wiki](https://wiki.mushureport.com/wiki/Mushu_Report)
  * [API docs](https://wiki.mushureport.com/api.php)
* Mediawiki resources:
  * [Manual:Bots](https://www.mediawiki.org/wiki/Manual:Bots)
  * [Manual:Creating a bot](https://www.mediawiki.org/wiki/Manual:Creating_a_bot)
  * [Wikimedia User-Agent policy](https://foundation.wikimedia.org/wiki/Policy:User-Agent_policy)
