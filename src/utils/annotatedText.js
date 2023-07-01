import { HayyimDictionary } from "@/sqlite";
import { sequelize } from "@/sqlite";

const Word = "Word";
const LineBreak = "LineBreak";
const Punctuation = "Punctuation";
const createObject = () => ({
  type: null,
  value: null,
  definition: null,
  word: null
});

const createPunctuationObject = element => {
  return [
    {
      ...createObject(),
      type: Punctuation,
      value: element.substr(element.length - 1)
    },
    toObject(element.substr(0, element.length - 1))
  ];
};

const createWordObject = element => ({
  ...createObject(),
  type: Word,
  value: element,
  word: element
});

const createLineBreakElement = element => ({
  ...createObject(),
  type: LineBreak,
  value: "<br/>",
  element
});

const toObject = element => {
  switch (true) {
    case isLineBreak(element):
      return createLineBreakElement();
    case isPunctuation(element):
      return createPunctuationObject(element);
    default:
      return createWordObject(element);
  }
};

const searchCandidates = value =>
  [/ی$/, /ها$/, /های$/].map(reg => value.replace(new RegExp(reg), ""));
const search = async object => {
  const result = await HayyimDictionary.findAll({
    attributes: [
      "word",
      [sequelize.fn("GROUP_CONCAT", sequelize.col("html"), "<br />"), "html"],
      [sequelize.fn("LENGTH", sequelize.col("word")), "l"]
    ],
    where: { word: [searchCandidates(object.value)] },
    raw: true,
    group: ["word"],
    order: [["l", "desc"]],
    limit: 1
  });
  return {
    definition: result.length ? result[0].html : "Not found",
    word: result.length ? result[0].word : object.word
  };
};
const setDefinition = async object => {
  if (object.type === Word) {
    const { definition, word } = await search(object);
    return {
      ...object,
      definition,
      word
    };
  }
  return object;
};
const isLineBreak = element => element === "<br/>";
const isPunctuation = element => /[!٬٫،؟.]/.test(element);
export const textToPayload = text => {
  return Promise.all(
    text
      .replaceAll("\n", " <br/> ")
      .split(" ")
      .map(toObject)
      .flat(Infinity)
      .map(setDefinition)
  ).then(array => array);
};

export const payloadToText = payload => {
  return payload
    .map(object => {
      if (isLineBreak(object.value)) {
        return "\n";
      }
      return object.value;
    })
    .join(" ")
    .replaceAll(" <br/> ", "\n");
};
