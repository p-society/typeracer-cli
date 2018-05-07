# typeracer-cli (WIP)

Typing practice from your terminal and features like online competition.
This is gonna be a big and awesome project.

# To-Do

- [x] Make as npm package
- [x] Offline mode practice
- [x] Random paragraph everytime
- [x] Add logical paragraphs
- [x] Show time
- [x] Show speed
- [x] Setup server
- [x] Design API for online mode
- [x] Online mode competition
- [ ] Write tests

# How to Use

Now its in condition when you can see it working without above undone features

**Clone the repo**

- `git clone https://github.com/p-society/typeracer-cli.git`

**Install packages**

- cd to folder and run `npm install`
- Run `npm link` **(!important)**

**npm link** will move it to your global configurations so that you can use it as npm package.

# commands

**Run as a npm package**

- `typerace -h` to see help
- `typerace p` to start practice mode.
- `typerace o -f` to start online mode

# Online mode

`typerace o -f` will prompt a question

**Are you starting server for race (y/N) ?**

Now 2 cases are there

- If **yes**
  - You will share **Room to join for race**, **Number of racers**, **Number(sort of password)**
  - All the above will be prompted if you select yes and all of your friends should fill them out same.

- If **no**  
  - Ask for **Room to join for race**, **Number of racers**, **Number(sort of password)** from your friend who created a private room to race.

Enjoy
