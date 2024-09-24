const terminal = require("../index.js");

describe("Terminal Module", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("start", () => {
    it("should write project information and port to stdout", () => {
      const mockWrite = jest
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);
      terminal.projectInfo = { name: "test-project", version: "1.0.0" };

      terminal.start("localhost", 3000);

      expect(mockWrite).toHaveBeenCalled();
      mockWrite.mockRestore();
    });
  });

  describe("pass", () => {
    it("should write success message to stdout", () => {
      const mockWrite = jest
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);
      terminal.pass("Operation successful");

      expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining("PASS"));
      mockWrite.mockRestore();
    });
  });

  describe("log", () => {
    it("should do nothing if verbose is 0", () => {
      terminal.setVerbose(0);
      const mockWrite = jest
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      terminal.log("This is a log message");
      expect(mockWrite).not.toHaveBeenCalled();

      mockWrite.mockRestore();
    });

    it("should write info message to stdout when verbose is 2", () => {
      terminal.setVerbose(2);
      const mockWrite = jest
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      terminal.log("Info message");
      expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining("INFO"));
      mockWrite.mockRestore();
    });

    it("should write error message to stdout when it is an error", () => {
      terminal.setVerbose(2);
      const mockWrite = jest
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);

      terminal.log("Error: Something went wrong");
      expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining("FAIL"));
      mockWrite.mockRestore();
    });

    it("should write object to console.log when data is an object", () => {
      terminal.setVerbose(2);
      const mockLog = jest.spyOn(console, "log").mockImplementation(() => true);

      terminal.log({ key: "value" });
      expect(mockLog).toHaveBeenCalledWith({ key: "value" });

      mockLog.mockRestore();
    });
  });

  describe("isError", () => {
    it("should return true if the data is an instance of Error", () => {
      const error = new Error("Test error");
      expect(terminal.isError(error)).toBe(true);
    });

    it("should return true if the string contains an error keyword", () => {
      expect(terminal.isError("Error: Test error")).toBe(true);
    });

    it("should return false for data that is not an error", () => {
      expect(terminal.isError("This is a message")).toBe(false);
      expect(terminal.isError({})).toBe(false);
      expect(terminal.isError(123)).toBe(false);
    });
  });

  describe("setup", () => {
    it("should replace console.error with terminal.log", () => {
      const originalError = console.error;
      terminal.setup();

      expect(console.error).toBe(terminal.log);

      console.error = originalError;
    });

    it("should backup the original console.error", () => {
      const originalError = console.error;

      terminal.setup();

      expect(console.backup).toBe(originalError);

      console.error = originalError;
    });

    it("should not replace console.error if console.backup exists", () => {
      console.backup = jest.fn();
      const originalError = console.error;
      const result = terminal.setup();

      expect(result).toBe(false);
      expect(console.error).toBe(originalError);

      delete console.backup;
    });

    it("should throw an error if console.error is not found", () => {
      const originalConsole = global.console;
      global.console = { log: jest.fn() };

      expect(() => terminal.setup()).toThrow("console.error is not found");

      global.console = originalConsole;
    });
  });

  describe("clear", () => {
    it("should call stdout.clearLine if stdout is TTY", () => {
      const originalIsTTY = process.stdout.isTTY;
      process.stdout.isTTY = true;

      if (!process.stdout.clearLine) {
        process.stdout.clearLine = jest.fn();
      }

      const mockClearLine = jest
        .spyOn(process.stdout, "clearLine")
        .mockImplementation(() => true);
      terminal.clear();
      expect(mockClearLine).toHaveBeenCalled();

      mockClearLine.mockRestore();
      process.stdout.isTTY = originalIsTTY;
      delete process.stdout.clearLine;
    });

    it("should not call stdout.clearLine if stdout is not TTY", () => {
      const originalIsTTY = process.stdout.isTTY;
      process.stdout.isTTY = false;

      process.stdout.clearLine = jest.fn();

      const mockClearLine = jest.spyOn(process.stdout, "clearLine");

      terminal.clear();
      expect(mockClearLine).not.toHaveBeenCalled();

      mockClearLine.mockRestore();
      process.stdout.isTTY = originalIsTTY;
      delete process.stdout.clearLine;
    });
  });

  describe("setVerbose", () => {
    it("should update the verbose level", () => {
      terminal.setVerbose(1);
      expect(terminal.verbose).toBe(1);
    });
  });
});
