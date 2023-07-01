# Todo
- [ ] Clean up quiz vue code
- [ ] Improve QCM ui
- [ ] Write tests
- [ ] Consolidate json properties case on import/export

# Backlog
- [ ] fix the app icon (build/icon.icns)
- [ ] Accept synonyms
- [ ] Increase font size
- [ ] difficult words quiz
- [ ] Fix non-reactive date, probably cause by directive
- [ ] Sort words by level
- [ ] Analytics
- [ ] Check for updates, setInterval
- [ ] Logging


For the provide farsi text. I want a json array that contains an object for each element of the text.
Elements can be words, punctuation and line break. The array must keep the element of the text in the same order 
and must be repeated if present more than once.
The json object must have the following attributes
{
    "word": "the word in farsi",
    "definition": "the English definition"
    "transliteration": "the farsi transliteration"
    "is_line_break": "true if you encounter a line break. False otherwise",
    "punctuation": "the punctuation sign if it is a punctuation element"
}

The text is as follow:  ""

