const responseToText = response => response.text();
const textToDom = text => new DOMParser().parseFromString(text, "text/html");
import { HayyimDictionary } from "@/sqlite";

const extractWords = dom => {
  return [...dom.querySelectorAll(".hw_result  div")]
    .filter(div => div.querySelector("hw") !== null)
    .map(div => {
      return {
        word: div.querySelector("hw b per").innerHTML,
        html: div.innerHTML
      };
    });
};

const saveWords = words => {
  return HayyimDictionary.bulkCreate(words);
};

export const importDictionary = async () => {
  await HayyimDictionary.destroy({
    where: {},
    truncate: true
  });
  for (let page = 1; page <= 2299; page++) {
    const url = `https://dsal.uchicago.edu/cgi-bin/app/hayyim_query.py?page=${page}`;
    await fetch(url)
      .then(responseToText)
      .then(textToDom)
      .then(extractWords)
      .then(saveWords);
  }
};
