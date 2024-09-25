# @guritso/terminal

A terminal node utility for enhanced logging and error handling.

| example |
| ------- |
| ![example](https://i.ibb.co/WHD4mXn/guritso-terminal-preview.png) |

## Installation

To install the package:

```bash
npm install @guritso/terminal
```

## Usage

To use the package, import it into your project:

```javascript
const terminal = require('@guritso/terminal');
```

or ESM:

```javascript
import terminal from '@guritso/terminal';
```

```javascript
// Setup the terminal (this is necessary to use the console.error function)
terminal.setup();

// Start the terminal with a your project's specific host and port ( both are optional) its only used for the project info
terminal.start('http://localhost', 3000);

// Log an information message
terminal.log('This is an info message');

// Log a success message
terminal.pass('This is a success message');

// Log an error message (it detects if the data is an error and display it with the fail log level)
terminal.log(new Error('This is an error message'));
```

## Methods

### `terminal.setup()`

Sets up the console.error to use the terminal.log function. Every error message will be displayed with the fail log level even if you don't use the terminal.log function.

### `terminal.start(host, port)` (optional)

Displays the project info and the host and port. if you want to display the project info on start of your app, this is a nice way to do it.

- `host` (string): The host to display.
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
  - `0`: no output (does't apply for `terminal.start()`)
  - `1`: same line output (does't apply for `terminal.pass()`)
  - `2`: new line output (default)

## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](./LICENSE) file for details.

