# Lorcana card updater

## Usage

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


### Running the script
TODO
