/*
function createOptionsCard() {
  // Create a text paragraph widget
  var textParagraph = CardService.newTextParagraph()
    .setText('<b>I couldn\'t find a free spot for everyone, but here are some options that might work:</b>');

  var shortenHead = CardService.newTextParagraph()
    .setText('<b>Shorten the MeetUp in 15 min</b>');

  var ShortenInput = CardService.newDecoratedText()
    .setText('Monday, 13:00')
    .setTopLabel('<b>2024-07-15</b>');

  var divider = CardService.newDivider();

  var scheduleButton = CardService.newTextButton()
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
          .setText('Schedule')
          .setOnClickAction(CardService.newAction()
              .setFunctionName('navigateConfirmPage'));

  var cancelButton = CardService.newTextButton()
    .setText("Cancel MeetUP Schedule")
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor('#FF6666')
    .setOnClickAction(CardService.newAction()
    .setFunctionName('createHomePageCard'));

  var timeFrameHead = CardService.newTextParagraph()
    .setText('<b>Extend the time frame in a ' + 'week' + "</b>");

  var timeFrameInput = CardService.newDecoratedText()
    .setText('Monday, 17:00')
    .setTopLabel("<b>2024-07-22</b>");

  var excludeHead = CardService.newTextParagraph()
    .setText("<b>Exclude some of the participants</b>");

  var excludeInput = CardService.newDecoratedText()
    .setText('Wednesday, 18:00')
    .setTopLabel('<b>2024-07-17</b>')
    .setBottomLabel('Without: ' + 'Golan Shmueli');

  // Create a card section and add the widgets
  var cardSection = CardService.newCardSection()
    .addWidget(textParagraph)
    .addWidget(divider)
    .addWidget(shortenHead)
    .addWidget(ShortenInput)
    .addWidget(scheduleButton)
    .addWidget(divider)
    .addWidget(timeFrameHead)
    .addWidget(timeFrameInput)
    .addWidget(scheduleButton)
    .addWidget(divider)
    .addWidget(excludeHead)
    .addWidget(excludeInput)
    .addWidget(scheduleButton)
    .addWidget(divider)
    .addWidget(cancelButton);

  // Create the card and add the section
  var card = CardService.newCardBuilder()
    .addSection(cardSection);  // Ensure name is properly set

  // Return the built card
  return card.build();
}

function navigateConfirmPage(e) {
    var card = createConfirmCard();
    return CardService.newNavigation().pushCard(card);
}
*/
