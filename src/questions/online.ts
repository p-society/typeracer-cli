/**
 * @constant question1
 * @constant question2
 * @constant question3
 * Setting Questions for online mode
 */

const question1 = [{
  type: "confirm",
  name: "join",
  message: "Are you starting server for race ?",
  default: false,
}];

const question2 = [
  {
    type: "input",
    name: "username",
    message: "Enter Username",
    validate(value) {
      if (!value) {
        return "Please enter Username";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "roomNumber",
    message: "Enter room address that you got above",
    validate(value) {
      if (!value) {
        return "Please enter room address";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "number",
    message: "Enter number of players (max 5)",
    validate(value) {
      if (value > 5) {
        return "Cannot exceed 5";
      } else if (value <= 1) {
        return "Cannot have competition with yourself in online mode";
      } else if (!value) {
        return "Please enter a value";
      } else if (isNaN(value) === true) {
        return "Please enter number only";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "randomNumber",
    message: "Enter any number between 1 & 2405 (It's a password), share it with your friends",
    validate(value) {
      if (value > 2405) {
        return "Cannot exceed 2405";
      } else if (value < 1) {
        return "Cannot be less than 1";
      } else if (!value) {
        return "Please enter a value";
      } else if (isNaN(value) === true) {
        return "Please enter number only";
      }
      return true;
    },
  },
];

const question3 = [
  {
    type: "input",
    name: "username",
    message: "Enter Username",
    validate(value) {
      if (!value) {
        return "Please enter Username";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "roomNumber",
    message: "Enter room address to join",
    validate(value) {
      if (!value) {
        return "Please enter room address";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "number",
    message: "(Confirmation) Enter number of players",
    validate(value) {
      if (value > 5) {
        return "Cannot exceed 5";
      } else if (value <= 1) {
        return "Cannot have competition with yourself in online mode";
      } else if (!value) {
        return "Please enter a value";
      } else if (isNaN(value) === true) {
        return "Please enter number only";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "randomNumber",
    message: "(Confirmation) Enter number when server was created",
    validate(value) {
      if (value > 2405) {
        return "Cannot exceed 2405";
      } else if (value < 1) {
        return "Cannot be less than 1";
      } else if (!value) {
        return "Please enter a value";
      } else if (isNaN(value) === true) {
        return "Please enter number only";
      }
      return true;
    },
  },
];

/**
 * @exports online
 * @constant
 */
export const online = {
  question1,
  question2,
  question3,
};
