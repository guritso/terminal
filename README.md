# @guri/terminal

A terminal node utility for logging and error handling.

## Installation

To install the package, use the following command:

```bash
npm install github:GuriTsuki/terminal
# or
pnpm install github:GuriTsuki/terminal
# or
yarn add @guri/terminal@github:GuriTsuki/terminal
```

### update

```bash
# add the new version on the end of the line
pnpm/npm/yarn install/add @guri/terminal@github:GuriTsuki/terminal#v1.0.0
```

## Usage

To use the package, import it into your project:

```javascript
import terminal from '@guri/terminal';
// Setup the terminal (this is necessary to use the console.error function)
terminal.setup();
// Start the terminal with a your project's specific host and port ( both are optional) its only used for the project info
terminal.start('http://localhost', 3000);
// Log an information message
terminal.log('This is an info message');
// Log a success message
terminal.pass('This is a success message');
// Log an error message (it detects if the data is an error and display it with the terminal.error function)
terminal.log(new Error('This is an error message'));
```

## API

### `terminal.start(host, port)`

Displays the project info and the host and port.

- `host` (string): The host to display.
- `port` (number): The port number to display.

### `terminal.pass(data)`

Displays a success message.

- `data` (string): The message to display.

### `terminal.log(data)`

Displays a log message.

- `data` (string | Error): The message or error to display.

### `terminal.setVerbose(verbose)`

Sets the verbose level. (0 = no output, 1 = same line output (does't apply for pass), 2 = new line output)

- `verbose` (number): The verbose level.

### `terminal.setup()`

Sets up the console.error to use the terminal.log function.

## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](./LICENSE) file for details.

