# @guri/terminal

A terminal node utility for logging and error handling.

## Installation

To install the package, use the following command:

```bash
pnpm install github:GuriTsuki/terminal
# or
npm install github:GuriTsuki/terminal
# or
yarn add github:GuriTsuki/terminal
```

## Usage

To use the package, import it into your project:

```javascript
import terminal from '@guri/terminal';
// Setup the terminal (this is necessary to use the console.error function)
terminal.setup();
// Start the terminal with a your project's specific port (optional) its only used for the project info
terminal.start(3000);
// Log an information message
terminal.log('This is an info message');
// Log a success message
terminal.pass('This is a success message');
// Log an error message (it detects if the data is an error and display it with the terminal.error function)
terminal.log(new Error('This is an error message'));
```

## API

### `terminal.start(port)`

Displays the project info and the port.

- `port` (number): The port number to display.

### `terminal.pass(data)`

Displays a success message.

- `data` (string): The message to display.

### `terminal.log(data)`

Displays a log message.

- `data` (string | Error): The message or error to display.

### `terminal.setVerbose(verbose)`

Sets the verbose level.

- `verbose` (number): The verbose level.

### `terminal.setup()`

Sets up the console.error to use the terminal.log function.

## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](./LICENSE) file for details.

