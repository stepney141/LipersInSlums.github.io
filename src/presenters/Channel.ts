import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { ChannelInfo, parseChannelSchema } from "@/model/Channel";
import { getFiles } from "@/lib/api";

type ChannelPathStr = `_channels/${string}.md`;

function parseChannel(channelPath: ChannelPathStr): ChannelInfo {
  const fullPath = path.resolve(channelPath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(fileContents);

  const parsed = parseChannelSchema.parse(data);
  const name =
    parsed.name ?? (fullPath.split("/").pop() ?? "").replace(".md", "");

  return {
    description: parsed.description,
    name,
    notes: [content],
    refs: parsed.refs ?? [],
    since: parsed.since,
    topic: parsed.topic,
    ignoreList: parsed.ignore_list ?? false,
    order: parsed.order,
    realPath: path.basename(fullPath).replace(".md", ""),
  };
}

export function getChannelByName(name: string): ChannelInfo {
  try {
    return parseChannel(`_channels/${name}.md`);
  } catch {
    console.warn("Channel not found: " + name);

    const channelIndex = channelInfo.findIndex((ch) => ch.name === name);
    if (channelIndex === -1) {
      throw new Error(`Channel not found: ${name}`);
    }

    const channel = channelInfo[channelIndex];

    return { ...channel, realPath: channel.name, order: channelIndex + 1 };
  }
}

export function getAllChannels(): ChannelInfo[] {
  const markdownChannelPaths = getFiles("_channels");
  const markdownChannels = markdownChannelPaths.map(
    (channel) => parseChannel(`_channels/${channel}` as ChannelPathStr), // getFiles で引っ張ってくる path は .md が付いている
  );

  return markdownChannels
    .concat(
      channelInfo.map((ch, index) => ({
        ...ch,
        realPath: ch.name,
        order: index + 1,
      })),
    )
    .filter((ch) => !ch.ignoreList)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

const channelInfo: Omit<ChannelInfo, "order" | "realPath">[] = [
  {
    name: "存在論",
    topic: '"在る"',
    description: "シュールなのを貼るやつ",
    since: "2018/04/26",
    notes: [],
    refs: [],
  },
  {
    name: "意味論",
    topic: "Colorless green ideas sleep furiously",
    description: "ダジャレ的なものを貼るやつ",
    since: "2018/04/26",
    notes: ["channel topicはチョムスキーの例文から。"],
    refs: [
      {
        name: "Colorless green ideas sleep furiously (Wikipedia)",
        href: "https://ja.wikipedia.org/wiki/Colorless_green_ideas_sleep_furiously",
      },
    ],
  },
  {
    name: "lisperはすぐそういうこと言う",
    topic: "そういうことだぞ",
    description: "Lisp",
    since: "2018/04/26",
    notes: [
      "Lispチャンネル。実はサーバー名の「LipersInSlums」のLipers部分はLispersのtypoらしい。",
    ],
    refs: [],
  },
  {
    name: "computer-science",
    topic: "CSってなんすか🤔 コスコス？ 自慰？ 涜聖？",
    description: "CS",
    since: "2018/04/26",
    notes: [
      "計算機科学やアルゴリズムのチャンネル。",
      "channel topicはこのチャンネル最初の発言から。（yuche13……）",
    ],
    refs: [],
  },
  {
    name: "こりーさんドスケベボディ部",
    topic: 'おう、"意味"、ヤるぞ。人類3500年の謎を、ここで解く。',
    description: "実質VRChat",
    since: "2018/04/27",
    notes: [
      "VRChatチャンネル。",
      "channel topicはこのチャンネル最初の発言から。",
      "3Dモデリングの話もされていたが、そちらの話はいつの間にか #こりーさんのぺろいわからせ棒 に移っていた。",
    ],
    refs: [
      {
        name: "こりーさんドスケベボディ部",
        href: "/posts/slum-glossary#こりーさんドスケベボディ部",
      },
      {
        name: "#こりーさんのぺろいわからせ棒",
        href: "/channels/こりーさんのぺろいわからせ棒",
      },
    ],
  },
  {
    name: "エロゲ",
    topic: "",
    description: "エロゲ",
    since: "2018/04/27",
    notes: [
      "アークナイツとブルーアーカイブ（と時々エロゲ）の話をする場所。",
      "元はちゃんとエロゲの話をする場所だったが、開始二か月ほどでアズールレーンが「実質エロゲ」として扱われ始めた。",
      "やがてスラム民の興味がアズールレーンから同じYostar運営のアークナイツとブルーアーカイブに移り、ここで話されるようになった。",
    ],
    refs: [],
  },
  {
    name: "かわいい司書cotenちゃん",
    topic: "kawaii Libralian coten chan",
    description: "過疎",
    since: "2018/04/28",
    notes: [
      "kotenちゃんというAIを作るためのチャンネルとして建てられた。",
      "プロジェクトが忘れられた現在、文献紹介チャンネルになっている。",
    ],
    refs: [],
  },
  {
    name: "煽り画像置き場",
    topic: "",
    description: "煽り画像置き場",
    since: "2018/04/29",
    notes: [],
    refs: [],
  },
  {
    name: "圏論は📦",
    topic: "",
    description: "圏論で殴り合う場所",
    since: "2018/05/03",
    notes: ["圏論とは書かれているが、数学や論理学などの話が広くなされている。"],
    refs: [],
  },
  {
    name: "はすけゆ",
    topic: "",
    description: "Haskell",
    since: "2018/05/03",
    notes: [],
    refs: [],
  },
  {
    name: "じんこうちのう(裏声)",
    topic: "",
    description: "じんこうちのう(裏声)",
    since: "2018/05/03",
    notes: ["AIや機械学習のチャンネル。"],
    refs: [
      {
        name: "ruby-on-rails（金切り声）",
        href: "/channels/ruby-on-rails（金切り声）",
      },
    ],
  },
  {
    name: "あーき！！！！！！！！！！！！、！",
    topic: "",
    description: "あーき",
    since: "2018/05/03",
    notes: ["アーキテクチャのチャンネル。チップセットや回路など。"],
    refs: [],
  },
  {
    name: "にむにむ🐻",
    topic: "",
    description: "Nim",
    since: "2018/05/03",
    notes: [],
    refs: [],
  },
  {
    name: "web乞食",
    topic: "",
    description: "なんかほしいもがはられてる",
    since: "2018/05/03",
    notes: [
      "誕生日などに欲しいものリストを貼るとプレゼントが来たり来なかったりする。",
    ],
    refs: [],
  },
  {
    name: "尻穴猫寂聴天皇",
    topic: "",
    description: "NSFW",
    since: "2018/05/04",
    notes: [
      "不審者情報や下ネタのチャンネル。",
      "天皇と呼ばれる存在(@Tzimtzum)がいる。",
      "天皇の好きな、ガルパンとアイマスの話もここに貼られる。",
      "うんこして報告すると褒められる。",
    ],
    refs: [
      {
        name: "尻穴猫寂聴",
        href: "/posts/slum-glossary#尻穴猫寂聴",
      },
    ],
  },
  {
    name: "就職相談窓口",
    topic: "",
    description: "闇",
    since: "2018/05/24",
    notes: ["仕事の愚痴と転職の相談チャンネル。"],
    refs: [],
  },
  {
    name: "rustacean隔離病棟",
    topic: "",
    description: "隔離病棟",
    since: "2018/06/25",
    notes: ["Rustチャンネル。"],
    refs: [],
  },
  {
    name: "世界名作劇場",
    topic: "",
    description: "名作",
    since: "2018/07/01",
    notes: [],
    refs: [],
  },
  {
    name: "stellaris",
    topic: "",
    description: "なんかゲーム総合みたいになってる気がする",
    since: "2018/07/07",
    notes: [
      "PCゲームをはじめとするコンシューマーゲームのチャンネル。",
      "エロゲは #エロゲ 、音ゲーは #雀荘『る雀どる』 へ。",
    ],
    refs: [
      {
        name: "#エロゲ",
        href: "/channels/エロゲ",
      },
      {
        name: "#雀荘『る雀どる』",
        href: "/channels/雀荘『る雀どる』",
      },
    ],
  },
  {
    name: "進捗管理",
    topic: "",
    description: "進捗を貼ると褒められたりする",
    since: "2018/07/22",
    notes: [],
    refs: [],
  },
  {
    name: "LugendreScreenShotBattles",
    topic: "",
    description: "@Lugendre のスクショを貼ってバトル！",
    since: "2018/11/22",
    notes: [
      "他人の発言を晒すバトル会場。@Lugendreでもスクショでもないことも多々ある。",
      "@Lugendreがハマっているもの（オーディオ、PCガジェット、紅茶など）の話が始まることも多い。",
    ],
    refs: [],
  },
  {
    name: "雀荘『る雀どる』",
    topic: "",
    description: "麻雀とか",
    since: "2018/12/12",
    notes: [
      "「音ゲーの筐体がある雀荘」として建てられた。",
      "音ゲーと麻雀の他にアーケードゲームの話がたまにされている。",
    ],
    refs: [],
  },
  {
    name: "フロントエンド血の池地獄",
    topic: "",
    description: "血の池地獄",
    since: "2018/12/29",
    notes: [],
    refs: [],
  },
  {
    name: "katainaka0503screenshot",
    topic: "",
    description: "過疎だしなんでいない人のチャンネルがあるのか",
    since: "2018/12/31",
    notes: [],
    refs: [],
  },
  {
    name: "未定義の男根",
    topic: "C++以外の話したら去勢な。",
    description: "C++",
    since: "2019/01/05",
    notes: [],
    refs: [],
  },
  {
    name: "今すぐoopの話をするのをやめろ",
    topic: "オブジェクト指向全般\n今すぐダウンロー\nド",
    description: "oop",
    since: "2019/05/16",
    notes: ["オブジェクト指向全般", "今すぐダウンロー", "ド"],
    refs: [],
  },
  {
    name: "いきもののふしぎ",
    topic: "自然科学なんもわからん",
    description: "いきもののふしぎ",
    since: "2019/08/04",
    notes: [],
    refs: [],
  },
  {
    name: "この沼、「深い」ジボボボボボボボボッ！",
    topic: "ロジバンという人工言語の話みたいよ？",
    description: "言語学とか",
    since: "2019/08/01",
    notes: ["人工言語や言語学、音声学などのチャンネル。"],
    refs: [],
  },
  {
    name: "狂気",
    topic: "インフラで消耗、しよ？",
    description: "インフラ",
    since: "2019/09/10",
    notes: [],
    refs: [],
  },
  {
    name: "こりーを躾ける本",
    topic: "スラム合同誌出るかも？",
    description: "LipersInSlumsの同人誌",
    since: "2019/10/09",
    notes: [
      "技術書典での頒布を目指して皆で合同誌を作るチャンネル。",
      "コロナ禍のため2020年の技術書典がオンライン開催になったため合同誌企画自体が流れた。",
    ],
    refs: [],
  },
  {
    name: "こりーさんのぺろいわからせ棒",
    topic: "おとこのこってほんとばか……///",
    description: "ぺろいさんって誰ですか",
    since: "2020/03/28",
    notes: ["どういうわけか3Dモデリングのチャンネルになっている。"],
    refs: [
      {
        name: "#こりーさんドスケベボディ部",
        href: "/channels/こりーさんドスケベボディ部",
      },
    ],
  },
  {
    name: "ruby-on-rails（金切り声）",
    topic: "",
    description: "Ruby on Rails",
    since: "2020/12/31",
    notes: [],
    refs: [
      {
        name: "じんこうちのう(裏声)",
        href: "/channels/じんこうちのう(裏声)",
      },
    ],
  },
  {
    name: "夏草や隣の部屋でふぁっく音",
    topic: "音楽理論やその他文化資本",
    description: "音および文化資本",
    since: "2021/06/13",
    notes: [
      "音楽、絵画、酒、ボドゲなどの文化的な諸々に関するチャンネル。",
      "派生サイトとして、住民が各々のオススメ音源を紹介するConsense(旧Scrapbox)がある(下記の外部リンク参照)。"
    ],
    refs: [
      {
        name: "音楽のすゝめ",
        href: "https://scrapbox.io/music-recommendation/"
      },
    ],
  },
];
