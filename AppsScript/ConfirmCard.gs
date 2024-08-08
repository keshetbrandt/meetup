function createConfirmCard() {
  // Create a text paragraph widget
  var textParagraph = CardService.newTextParagraph()
    .setText('<b>The meeting has been scheduled successfully.</b>');

  var BackHomeButton = CardService.newTextButton()
    .setText('🏠')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor("#007bff")
    .setOnClickAction(CardService.newAction()
    .setFunctionName('createHomePageCard'));

  var divider = CardService.newDivider();

  // Create a card section and add the widgets
  var carddis = CardService.newCardSection()
    .addWidget(textParagraph)
    .addWidget(divider)
    .addWidget(BackHomeButton);

  // Create the card and add the section
  var card = CardService.newCardBuilder()
    .addSection(carddis);  // Ensure name is properly set

  // Return the built card
  return card.build();
}

        
        
