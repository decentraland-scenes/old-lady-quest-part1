import { Dialog, NPC } from '@dcl/npc-scene-utils'
import { RemoteQuestTracker } from '@dcl/ecs-quests'
import { ProgressStatus } from 'dcl-quests-client/quests-client-amd'
import { query } from '@dcl/quests-query'

let floor = new Entity()
engine.addEntity(floor)
floor.addComponent(new GLTFShape('models/FloorBaseDirt_01.glb'))
floor.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8),
  })
)

export let oldLady: NPC
let client: RemoteQuestTracker

export enum taskIds {
  intro = '82549f6d-3a2d-4053-96de-40269b188d3b',
  gems = 'c07a44ba-4aa7-47ae-a29a-82ecfb2129b7',
  placeGems = 'a0f00c60-66a2-482e-81ee-c831ff1f8e07',
  temple = '6cae123e-529b-4c6c-ae5c-0a1fafee95d9',
  outro = 'c8d6ad3e-1f14-4983-8e15-0eb4f8c83507',
  potion = 'aafc3022-5469-4616-8e4a-4ce2d273ac25',
  bell = '5656b183-a53a-4f95-a1ef-735c382178ef',
}

export async function handleQuests() {
  //let q = await getQuests()

  client = await new RemoteQuestTracker('80817d29-677c-4b1d-96de-3fedf462be4d')

  const q = await client.getCurrentStatePromise()
  //let q = await client.refresh()
  log('QUEST ', q)

  if (q.progressStatus != ProgressStatus.COMPLETED) {
    oldLady = new NPC(
      { position: new Vector3(8, 0.1, 8), rotation: Quaternion.Euler(0, 0, 0) },
      'models/oldlady.glb',
      () => {
        if (!query(q).isTaskCompleted(taskIds.intro)) {
          oldLady.talk(IntroTalk)
        } else if (!query(q).isTaskCompleted(taskIds.potion)) {
          oldLady.talk(Other, 'potion')
        } else if (!query(q).isTaskCompleted(taskIds.bell)) {
          oldLady.talk(Other, 'bell')
        } else if (!query(q).isTaskCompleted(taskIds.temple)) {
          oldLady.talk(Other, 'chaman')
        } else if (!query(q).isTaskCompleted(taskIds.outro)) {
          oldLady.talk(OutroTalk)
        } else {
          oldLady.talk(Other, 'done')
        }
      },
      {
        idleAnim: `idle1`,
        onlyClickTrigger: true,
        faceUser: true,
      }
    )
  }
}

handleQuests()

export let IntroTalk: Dialog[] = [
  {
    text: `Hey there, <color="red"> did you miss me </color>? I honestly don't know <b>how</b> you could carry on <i>so long </i> without me. <sprite index=1>`,
    triggeredByNext: () => {
      oldLady.playAnimation(`HeadShake_No`, true, 1.83)
      client.startQuest()
    },
  },
  {
    text: `Do you want to know how I became what I am?`,
    isQuestion: true,
    offsetY: 40,
    buttons: [
      {
        goToDialog: 'yes',
        label: 'Yes',
        triggeredActions: () => {
          oldLady.playAnimation(`Cocky`, true, 2.93)
        },
      },
      {
        goToDialog: 'no',
        label: 'No',
      },
    ],
  },
  {
    text: `I was born straight out of hell. Lovely place if you ask me, so many scenic views and warm weather all year round.`,
    name: 'yes',
  },
  {
    text: `You should go there, take a little tour. I'll set you up with my friend the chaman. He'll show you some of the fun stuff.`,
  },
  {
    text: `Go to 75,0 and look him up. You can't miss him, there's literally a bright red arrow pointing at him right above his head.`,
    triggeredByNext: () => {
      client.makeProgress(taskIds.intro, {
        type: 'single',
        status: ProgressStatus.COMPLETED,
      })
    },
    isEndOfDialog: true,
  },
  {
    text: `Ok, you're missing a hell of a story! I need to loosen up on the bad puns a little, right?`,
    name: 'no',

    isEndOfDialog: true,
  },
]

export let OutroTalk: Dialog[] = [
  {
    text: `Hey, it looks like you had a grand time there!  Didn't you?`,
    triggeredByNext: () => {
      oldLady.playAnimation(`HeadShake_No`, true, 1.83)
    },
  },
  {
    text: `No need to thank me. Just spread the word. Tell your friends and family that they should all go straight to hell too!`,
    triggeredByNext: () => {
      client.makeProgress(taskIds.outro, {
        type: 'single',
        status: ProgressStatus.COMPLETED,
      })
    },
    isEndOfDialog: true,
  },
]

export let Other: Dialog[] = [
  {
    name: 'done',
    text: `Hope you enjoyed`,
    isEndOfDialog: true,
  },
  {
    name: 'bell',
    text: `I hear you still didn't ring the bell. Ohh you're missing such fun!`,
    isEndOfDialog: true,
  },
  {
    name: 'potion',
    text: `I hear you haven't tried any of the traditional drinks, you're missing out!`,
    isEndOfDialog: true,
  },
  {
    name: 'chaman',
    text: `My buddy the chaman tells me he needs some help over there. He'd really appreciate it.`,
    isEndOfDialog: true,
  },
]
