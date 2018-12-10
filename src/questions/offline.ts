/**
 * @constant question1
 * Setting Questions for offline mode to retry
 */

const question1 = [{
  type: "list",
  name: "whatdo",
  message: "What do you want to do?",
  choices: [
    "Retry",
    "Exit",
  ],
}];

/**
 * @exports offline
 * @constant
 */
export const offline = {
  question1,
};
