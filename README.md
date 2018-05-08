<p align="center">
<img src="https://user-images.githubusercontent.com/24803604/39766933-2386f1d8-5303-11e8-9f34-76c3b53f58c7.png" />
</p>


Typing practice from your terminal and features like practice mode and online competition mode.

# Installation

run `npm i --global typeracer-cli` from your command line

# Features

- Practice mode
- Online mode (can ask for a rematch)

# Usage

run `typerace` or `typerace -h` to its usage

**Output**

```
Usage: typerace [options] [command]

  Options:

    -h, --help          output usage information

  Commands:

    practice|p          Start typeracer
    online|o [options]  Start game in online mode
```

# Commands

**Practice mode**

- `typerace p` to start practice mode.

**Preview of practice mode**

![practice](https://user-images.githubusercontent.com/24803604/39727452-565bb37a-5270-11e8-82ad-4c882147dc03.gif)


**Online mode**

**Prevew of online mode**

![online](https://user-images.githubusercontent.com/24803604/39727662-431d9b60-5271-11e8-80fb-40698302c22d.gif)


 - `typerace o -f` to start online mode which will prompt a question

**Are you starting server for race (y/N) ?**

Now 2 cases are there

- If **yes**
  - You will share **Room to join for race**, **Number of racers**, **Number(sort of password)**
  - All the above will be prompted if you select yes and all of your friends should fill them out same.

- If **no**  
  - Ask for **Room to join for race**, **Number of racers**, **Number(sort of password)** from your friend who created a private room to race.

Enjoy :fire:
