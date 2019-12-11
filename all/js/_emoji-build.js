/* eslint-disable */

var _emojis = [];
$('td.code').each(function() {
	if ($(this).siblings('.name').first().text().includes('⊛') || parseInt($(this).first().prev().text()) === 484 || parseInt($(this).first().prev().text()) === 485 || parseInt($(this).first().prev().text()) === 486) {
		// do nothing
    } else {
      _emojis.push({
        order: parseInt($(this).first().prev().text()),
        code: $(this).text().replace(new RegExp('U', 'g'), '').replace(new RegExp('[+]', 'g'), ''),
        emoji: $(this).next().text(),
        name: $(this).siblings('.name').first().text().replace(new RegExp('[:\.\,\'\`\’\!\(\)\“\”]', 'g'), '').replace(new RegExp('[\#]', 'g'), 'pound').replace(new RegExp('[\*]', 'g'), 'asterisk').replace(new RegExp('flag ', 'g'), 'flag for ').replace(new RegExp('&', 'g'), 'and').replace(new RegExp('é', 'g'), 'e').replace(new RegExp(' - ', 'g'), ' ').replace(new RegExp('ô', 'g'), 'o').replace(new RegExp('ç', 'g'), 'c').replace(new RegExp('North Macedonia', 'g'), 'flag North Macedonia').replace(new RegExp('Macao SAR China', 'g'), 'flag macao sar china').replace(new RegExp('ã', 'g'), 'a').replace(new RegExp('í', 'g'), 'i').replace(new RegExp('Eswatini', 'g'), 'flag eswatini').replace(new RegExp('Åland', 'g'), 'aland'),
        keywords: $(this).siblings('.name').last().text().split(', ')
      });
    }
});

for (var index = _emojis.length - 1; index >= 0; index--) {
  var emoji = _emojis[index];
  // Determine if this is a child emoji and get the parent emoji
  var types = emoji.code.match(/U[+]+[0-9A-F]*/gi)
  if (Array.isArray(types) && types.length === 2) {
    var parentEmojiCode = types[0];
    var parentEmoji = _emojis.filter(function(_emoji) {
      return _emoji.code === parentEmojiCode;
    })[0];

    if (emoji.no < 1535) {
      // Initialise the parent emoji types and append child emoji types
      if (!parentEmoji.hasOwnProperty('types'))
        parentEmoji['types'] = [];

      parentEmoji['types'].push(emoji.code);

      // Clean up and remove this child emoji
      _emojis.splice(index, 1);
    }
  }
}

_emojis = JSON.stringify(_emojis);
