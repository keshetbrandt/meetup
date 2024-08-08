var userProperties = PropertiesService.getUserProperties();

// Function to create a card for scheduling a meeting
function createScheduleMeetingCard(e, generatedAgenda="") {
    //Create a headline for Title
    var titleheadline = CardService.newTextParagraph()
    .setText('Title for the meeting');

    //Create a headline for particpants
    var participantsheadline = CardService.newTextParagraph()
    .setText('Participants (split by comma)');

    //Create a headline for description
    var descriptionheadline = CardService.newTextParagraph()
    .setText('Description');

    //Create a headline for When
    var whenheadline = CardService.newTextParagraph()
    .setText('When?');

    //Create a headline for Duratiion
    var durationheadline = CardService.newTextParagraph()
    .setText('Duration');

    //Create a headline for location
    var locationheadline = CardService.newTextParagraph()
    .setText('Location');

    //Create a headline for preffered time
    var prefferedtimeheadline = CardService.newTextParagraph()
    .setText('Preffered time');

    // Create a TextInput for participants
    var participantsInput = CardService.newTextInput()
        .setTitle('Enter participants')
        .setFieldName('participants')
        .setMultiline(true)
    if (e && e.formInputs.participants){
        participantsInput.setValue(e.formInputs.participants[0]);
    }

    // Create input field for title
    var titleInput = CardService.newTextInput()
        .setTitle('Enter title')
        .setFieldName('title')
        .setMultiline(true);
    if (e && e.formInputs.title){
        titleInput.setValue(String(e.formInputs.title[0]));
    }

    // Create input field for duration
    var durationDefaultOption = "30 min"
    if (e && e.formInputs.duration){
      var durationDefaultOption = e.formInputs.duration;
    }
    var durationInput = createDurationDropdown(durationDefaultOption);

    // Create input field for when
    var timeFrameDefaultOption = 'This week';
    if (e && e.formInputs.timeframe){
      timeFrameDefaultOption = e.formInputs.timeframe;
    }
    var timeframeInput = createTimeframeDropdown(timeFrameDefaultOption); 

    // Create input field for preffered time
    var prefferedtimeDefaultOption = 'Choose prefferedtime from list'
    if (e && e.formInputs.prefferedtime){
      var prefferedtimeDefaultOption = e.formInputs.prefferedtime;
    }
    var prefferedtimeInput = createprefferedtimeMultiChoice(prefferedtimeDefaultOption);

    // Create a TextInput for description
    var descriptionInput = CardService.newTextInput()
        .setTitle('Enter description')
        .setFieldName('description')
        .setMultiline(true)
    if (e && e.formInputs.description){
        descriptionInput.setValue(e.formInputs.description[0]);
    }

    // Create a TextInput for location
    var locationInput = CardService.newTextInput()
        .setTitle('Enter location')
        .setFieldName('location')
        .setMultiline(true)
    if (e && e.formInputs.location){
        locationInput.setValue(e.formInputs.location[0]);
    }

    var homePageButton = CardService.newTextButton()
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setBackgroundColor("#007bff")
        .setText('🏠')
        .setOnClickAction(CardService.newAction()
        .setFunctionName('createHomePageCard'));
    
    // Create a button to schedule the meeting
    var scheduleButton = CardService.newTextButton()
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor("#009FDC")
        .setText('Find time!')
        .setOnClickAction(CardService.newAction()
        .setFunctionName('validateAndSubmitForm'));    //CHANGE FUNCTION!!!

    // Create a CardSection to hold the form components
    var meetingForm = CardService.newCardSection()
        .addWidget(titleheadline)
        .addWidget(titleInput)
        .addWidget(descriptionheadline)
        .addWidget(descriptionInput)
        .addWidget(participantsheadline)
        .addWidget(participantsInput)
        .addWidget(whenheadline)
        .addWidget(timeframeInput)
        .addWidget(durationheadline)
        .addWidget(durationInput)
        .addWidget(locationheadline)
        .addWidget(locationInput)
        .addWidget(prefferedtimeheadline)
        .addWidget(prefferedtimeInput);

    //Create schedule meeting footer with button
    var cardFooter = CardService.newFixedFooter()
        .setPrimaryButton(scheduleButton)
        .setSecondaryButton(homePageButton);

    // Create the main Card
    var card = CardService.newCardBuilder()
        .addSection(meetingForm)
    
    card.setFixedFooter(cardFooter)

    return card.build();
}



// Function to create a dropdown menu for the duration
function createDurationDropdown(durationDefaultOption) {
    var dropdown = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      // .setTitle('Duration')
      .setFieldName('duration')
      // .addItem('Select duration', '', true) // Default option
      .addItem('30 Min', '30 min', durationDefaultOption == '30 min')
      .addItem('60 Min', '60 min', durationDefaultOption == '60 min')
      .addItem('90 Min', '90 min', durationDefaultOption == '90 min')
      .addItem('120 Min', '120 min', durationDefaultOption == '120 min')
  
  
    return dropdown;
  }

// Function to create a dropdown menu for the timeframe
function createTimeframeDropdown(timeFrameDefaultOption) {
    var dropdown = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle('Default time frames')
      .setFieldName('timeframe')
      // .addItem('Select Timeframe', '', true) // Default option
      .addItem('Today', 'Today', timeFrameDefaultOption == 'Today')
      .addItem('Tomorrow', 'Tomorrow', timeFrameDefaultOption == 'Tomorrow')
      .addItem('This Week', 'This week', timeFrameDefaultOption == 'This week')
      .addItem('Next Week', 'Next week', timeFrameDefaultOption == 'Next week');
  
    return dropdown;
  }

  function createprefferedtimeMultiChoice(prefferedtimeDefaultOption) {
    var multiChoice = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.CHECK_BOX)
      .setTitle('Choose time frame(s) from list')
      .setFieldName('prefferedtime')
      .addItem('Morning', 'Morning', prefferedtimeDefaultOption.includes('Morning'))
      .addItem('Noon', 'Noon', prefferedtimeDefaultOption.includes('Noon'))
      .addItem('Afternoon', 'Afternoon', prefferedtimeDefaultOption.includes('Afternoon'))
      .addItem('Evening', 'Evening', prefferedtimeDefaultOption.includes('Evening'));
    
    return multiChoice;
  }

  //to check if usable
  function navigateMeetingOptionsPage(e) {
    var card = createOptionsCard();
    return CardService.newNavigation()
      .pushCard(card);
  }


  function validateAndSubmitForm(e) {
    var formInput = e.formInput; // Get the form input data
     
    //nice to have
    /*
    //Check if TimeFrame was selected in case of default time frames
      var timeframe = formInput.timeframe;
      if (!timeframe){
        return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
        .setText("You must select timeframe for the meeting"))
        .build();
      }
    */

    //Check title is not empty
    var title = formInput.title;
    if (!title || title.trim() === '') {
      // Create a card section to hold the notification
      return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
      .setText("Meeting title cannot be empty"))
      .build();
    }
  
    // Check if participants are valid email
    var participants = formInput.participants;
    if (participants){
      participants = participants.split(',');
      for (var i = 0; i < participants.length; i++) {
        if (!isValidEmail(participants[i].trim())) {
          return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
            .setText(participants[i] + " is not a valid email"))
            .build();
        }
      }
    }
  
  
    //Check if duration was selected
    var duration = formInput.duration;
    if (!duration){
      return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
      .setText("You must select duration for the meeting"))
      .build();
    }
  
    // If all validations pass, you can submit the form
    return scheduleMeetingButtonClick(e);
  
  }

  function scheduleMeetingButtonClick(e) {

    var formResponse = e.formInputs;
  
    // Extract form data
    var title = formResponse.title[0];
    var participants = formResponse.participants ? formResponse.participants[0] : "";
    var description = formResponse.description ? formResponse.description[0] : "";
    var location = formResponse.location ? formResponse.location[0] : "";
    var duration = formResponse.duration[0];
    var when = formResponse.timeframe[0];
    //make sure it's ok
    var preferredTime = formResponse.prefferedtime ? formResponse.prefferedtime : [];
    for (var i =0; i<participants.length; i++){
      participants[i] = participants[i].toLowerCase();
    }
    /*
    if (formResponse.timeframe){
      var timeframe = formResponse.timeframe[0];
    }
    else{
      var fromDate = roundToNearest15Minutes(formResponse.fromDate[0].msSinceEpoch);
      var untilDate = roundToNearest15Minutes(formResponse.untilDate[0].msSinceEpoch);
      var timeframe = [fromDate, untilDate];
    }
    */
    var useremail = Session.getActiveUser().getEmail();
  
    
    // You can process the form data here, e.g., send it to a server or Google Calendar
    receivedData = PostMeeting(title, participants, description,location, duration, when, preferredTime, useremail);
  
    //Delete the false
    if (receivedData.message === "success") {   // Return a confirmation card
  
      var confirmationCard = createConfirmationCard(receivedData.data);
  
      return CardService.newNavigation()
        .pushCard(confirmationCard);
    }
    if (receivedData.message === "dilemma"){
  
      var dilemmaCard = createDilemmaCard(receivedData.id, receivedData.data);
  
      return CardService.newNavigation()
      .pushCard(dilemmaCard);  
    }
    else{ //Return error has occured
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setText('An error has occured'))
          .build();
  
    }
    
  }




// Function to validate an email address using a regular expression
function isValidEmail(email) {
    // Define a regular expression for email validation
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
