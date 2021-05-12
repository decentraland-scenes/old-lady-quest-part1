# old-lady-quest-part1

An example scene that handles quests.

This repo contains part 1 of 2. The same quest is continued on this repo:

[Gamer Plaza](https://github.com/decentraland-scenes/Gamer-Plaza)

> Note: This other repo is also private, you may need to request access to it.

This quest includes some single tasks, and a numerical task. The numerical task may be reset to 0 if the player doesn't complete it in full in time and then attempts again.

Part 1 has a very simple setup, part 2 is a more elaborate scene where things are more abstracted.

Check the file `quest-example.json` to see what was uploaded to the quests server to match this scene.

## Quest library

### Install

To install the library in a Decentraland scene, run:
`npm i dcl-ecs-quests -B`

Then open your scene’s tsconfig.json file, and add the following to the paths object:

```json
  "dcl-quests-client/quests-client-amd": [
        "./node_modules/dcl-quests-client/quests-client-amd"
      ],
```

Finally, run dcl start or dcl build on your project for all the internal files of the library to get properly built.

Then on your scene’s Typescript files import the library by writing the following:

```ts
import { RemoteQuestTracker } from 'dcl-ecs-quests'
import { ProgressStatus } from 'dcl-quests-client/quests-client-amd'
```

### Initiate a quest tracker

All interactions with the quest server and the quest UI are handled by a quest tracker object.

To initiate a quest tracker, create a new RemoteQuestTracker object, passing at least a quest ID, referencing a quest that’s already created in the quests server.

```ts
async function handleQuests() {
  let client = await new RemoteQuestTracker(
    '4e72efcb-4f92-4eed-ad6b-ec683d42bd76'
  )
}
```

> Note: Since the constructor of RemoteQuestTracker is asynchronous, you should run it inside an async function or an async block. All examples from now on will be assumed to run asynchronously.
