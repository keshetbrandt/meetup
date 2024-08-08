function showAvailabilityPage(dbGet) {
    // var userPreferences = getUserPreferences();
    var card = CardService.newCardBuilder()
      .setName("Preferences")
      .setHeader(CardService.newCardHeader().setTitle("<i>Your working preferences</i>"))
      // .addSection(CardService.newCardSection());
      //   // .addWidget(CardService.newTextParagraph()
      //   //   .setText("Your Working Hour Preferences:")));
  
    // Define the options for the working hours dropdowns
    var workingHourOptions = [
      '06:00 AM','06:30 AM','07:00 AM','07:30 AM','08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM',
      '00:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM','10:00 PM',
      'Not working'
    ];
  
    var userProperties = PropertiesService.getUserProperties();
    if (dbGet){
      //Get preferences from DB
      var prefResponse = getUserPref(Session.getActiveUser().getEmail());
      //Save preferences in property service
      userProperties.setProperty('userPref',JSON.stringify(prefResponse));
    }
    else{ //Use preferences from property service
      var prefResponse = JSON.parse(userProperties.getProperty('userPref'));
  
    }
  
    // Loop through days and add widgets for each day, including two dropdowns side by side
    for (var i = 0; i < 7; i++) {
      var day = prefResponse[i].day;
  
      var dayLabel = CardService.newKeyValue()
        .setContent("<b>"+day+"</b>")
        .setMultiline(true);
  
      toggleText = prefResponse[i].works ? 'Working' : 'Not Working';
      toggleBool = prefResponse[i].works ? true : false
      var toggleSwitchAction = CardService.newAction()
      .setFunctionName('handleToggleWorkDay')
      .setParameters({index: String(i)});
  
      var workCheckBox = CardService.newSwitch()
      .setControlType(CardService.SwitchControlType.SWITCH)
      .setFieldName('Working day')
      .setOnChangeAction(toggleSwitchAction)
      .setSelected(toggleBool)
  
      var switchWidget = CardService.newDecoratedText()
      .setText(toggleText)
      .setSwitchControl(workCheckBox);
  
      var section = CardService.newCardSection()
          .addWidget(dayLabel)
          .addWidget(switchWidget)
  
      if (prefResponse[i].works){  //Create dropdowns
  
      // Create the first dropdown for working hours
      var dropdown1 = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Starting Hour")
        .setFieldName(day + '_1')
  
      // Add the predefined options to the first dropdown
      for (var j = 1; j < workingHourOptions.length; j++) {
        var option = workingHourOptions[j];
        dropdown1.addItem(option, option, option === prefResponse[i].start);
      }
  
      // Create the second dropdown for working hours
      var dropdown2 = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Ending Hour")
        .setFieldName(day + '_2')
  
      // Add the predefined options to the second dropdown
      for (var k = 1; k < workingHourOptions.length; k++) {
        var option = workingHourOptions[k];
        dropdown2.addItem(option, option, option === prefResponse[i].end);
      }
  
        section.addWidget(dropdown1)
              .addWidget(dropdown2);
      }
  
      card.addSection(section);
    }
  
    var saveChangesButton = CardService.newTextButton()
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor("#007bff")
    .setText('Submit')
    .setOnClickAction(CardService.newAction()
    .setFunctionName('handleSavePreferences'))
  
    var homePageButton = CardService.newTextButton()
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
    // .setBackgroundColor("#007bff")
    .setText('Back')
    .setOnClickAction(CardService.newAction()
    .setFunctionName('createHomePageCard'))
  
    var cardFooter = CardService.newFixedFooter()
    .setPrimaryButton(saveChangesButton)
    .setSecondaryButton(homePageButton);
  
    // Add a "Save preferences" button at the end
    card.addSection(CardService.newCardSection()
      // .addWidget(CardService.newButtonSet()
      //   .addButton(CardService.newTextButton()
          .addWidget(CardService.newButtonSet()));
          // .addButton(saveChangesButton)
          // .addButton(homePageButton)));
  
    card.setFixedFooter(cardFooter);
  
    return card.build();
  }
  
  function handleToggleWorkDay(e){
    index = e.parameters.index;
  
    var userProperties = PropertiesService.getUserProperties();
    var userPref = JSON.parse(userProperties.getProperty('userPref'));
    
    userPref[index].works = !userPref[index].works
    userProperties.setProperty('userPref',JSON.stringify(userPref));
    validateAndSaveProperty(userPref, e.formInput)
    return showPreferencesPage(false)
  
  }
  
  
  //Checks if user have changed his preferences
  function validateAndSaveProperty(userPref, formInput) {
  
    // Check for differences between formInput and userPref
    for (var i = 0; i < userPref.length; i++) {
      var day = userPref[i].day;
      
      // Check if the day exists in formInput and if the values are different
      if (formInput.hasOwnProperty(day+'_1')){
        var formInputStart = formInput[day + '_1'];
        var userPrefStart = userPref[i].start;
        if (formInputStart !== userPrefStart){
          userPref[i].start = formInputStart;
        }
        if (userPref[i].works && userPref[i].start === 'Not working'){
          return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
            .setText('Start hour on '+ userPref[i].day + " must be valid hour"))
              .build(); 
        }
      }
      if (formInput.hasOwnProperty(day+'_2')) {
        var formInputEnd = formInput[day + '_2'];
        var userPrefEnd = userPref[i].end; 
        if (formInputEnd !== userPrefEnd) {
          userPref[i].end = formInputEnd;         
        }
        if (userPref[i].works && userPref[i].end === 'Not working'){
          return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
            .setText('End hour on '+ userPref[i].day + " must be valid hour"))
              .build(); 
        }
      }
    }
  
    //Update userPref into Property service
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('userPref',JSON.stringify(userPref));
  
    return undefined;
  
  
  }
  
  function handleSavePreferences(e) {
  
    var formInput = e.formInput;
  
    // Retrieve and parse the prefResponse from user properties
    var userProperties = PropertiesService.getUserProperties();
    var userPref = JSON.parse(userProperties.getProperty('userPref'));
  
    // Check if there was a change in pref, if so, send to server using post
    invalidNotification = validateAndSaveProperty(userPref,formInput);
  
    if (invalidNotification){
      return invalidNotification;
    }
  
    //Get userPref after changes made and updated in 'checkPrefChange' function
    var userPref = JSON.parse(userProperties.getProperty('userPref'));
  
    // Post the changes to the server and alert pref changed
    updateUserPreferences(userPref);
  
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Changes saved'))
          .build();
  } 
  
  
  
