function getUserFirstName(user) {
    // You can use the People API to retrieve the user's first name
    var userFirstName = '';
    try {
        var userInfo = People.People.get('people/me', { personFields: 'names' });
        if (userInfo.names && userInfo.names.length > 0) {
            userFirstName = userInfo.names[0].givenName;
        }
    } catch (e) {
        // Handle any errors that may occur while fetching the user's first name
        console.error('Error fetching user first name: ' + e);
    }
    return userFirstName;
}

function onHomepage() {
    validEmails = ['matantalbi@gmail.com', 'keshetbrandt00@gmail.com', 'yuvalrafaeli1@gmail.com', 'golan.shmueli@gmail.com', 'idantalvi@gmail.com']
    email = Session.getActiveUser().getEmail();
    if (validEmails.includes(email)) {
        return createHomePageCard();
    }
    if (checkUser(email)) {
        return createHomePageCard();
    } else {
        return signInPage();
    }
}

function createHomePageCard() {

    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('filledAgenda', "");
    userProperties.setProperty('generatedAgenda', "");
    var user = Session.getActiveUser();
    var userFirstName = getUserFirstName(user);

    // Fetch the upcoming meeting information (replace with your actual logic)
    var upcomingMeeting = getUpcomingMeeting(user);

    // Image URL (replace with your image URL)
    var imageUrl = 'https://i.postimg.cc/xdW9FbJr/image.jpg';

    // Create an Image widget
    var imageWidget = CardService.newImage()
        .setImageUrl(imageUrl)
        .setAltText('Your Image Description'); // Add alt text for accessibility

    // Creating the Availability button with the same style as Schedule Meeting
    var availabilityButton = createButton('<i>   Change Availability   </i>', 'availabilityAction')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor('#2792ef'); // Use the same color for consistency

    var scheduleButton = createButton('<i>+    Schedule  Meeting    </i>', 'navigateToSchedulePage')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor('#2792ef') // Different color for emphasis

    var card = CardService.newCardBuilder()
        .addSection(CardService.newCardSection()
            .addWidget(CardService.newTextParagraph()
                .setText('<b>Hello ' + userFirstName + ', Welcome back!</b>')))
        .addSection(CardService.newCardSection()
            .addWidget(imageWidget))  // Add the image before the buttons
        .addSection(getUpcomingMeeting(Session.getActiveUser()))
        .addSection(CardService.newCardSection()
            .addWidget(scheduleButton)
        .addSection(CardService.newCardSection()
            .addWidget(availabilityButton)) // Add the Availability button here
        .addSection(CardService.newCardSection()
            .addWidget(CardService.newTextParagraph()
                .setText('Coming soon...')))
        .build();

    return card;
}


function getUpcomingMeeting(user) {
    var calendarId = user.getEmail(); // Replace with your Google Calendar ID
    var now = new Date();
    var twentyFourHoursLater = new Date();
    twentyFourHoursLater.setDate(now.getDate() + 1); // Get meetings in the next 24 hours

    var events = CalendarApp.getCalendarById(calendarId)
        .getEvents(now, twentyFourHoursLater);

    var section = CardService.newCardSection()
        .setHeader('<b>Your upcoming meetings</b>')
        .setCollapsible(true)
        .setNumUncollapsibleWidgets(2)

    var userTimeZone = CalendarApp.getDefaultCalendar().getTimeZone();

    for (var i = 0; i < events.length; i++) {
        var upcomingMeeting = events[i];
        var meetingTitle = upcomingMeeting.getTitle();
        var meetingStartTime = upcomingMeeting.getStartTime();
        var meetingEndTime = upcomingMeeting.getEndTime();
        var formattedStartTime = Utilities.formatDate(meetingStartTime, userTimeZone, 'HH:mm');
        var formattedEndTime = Utilities.formatDate(meetingEndTime, userTimeZone, 'HH:mm');

        var meetingText = CardService.newDecoratedText()
            .setText("<i>" + meetingTitle + "</i>")
            .setBottomLabel(formattedStartTime + " - " + formattedEndTime)

        section.addWidget(meetingText);
    }

    if (events.length === 0) {
        section.addWidget(CardService.newDecoratedText()
            .setText('No upcoming meetings.'));
    }
    return section;
}

function createButton(text, actionFunctionName) {
    return CardService.newTextButton()
        .setText('<button class="custom-button">' + text + '</button>')
        .setOnClickAction(CardService.newAction()
            .setFunctionName(actionFunctionName));
}

function createSecondaryButton(text, actionFunctionName) {
    return CardService.newTextButton()
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor("#E67C73")
        .setText('<button class="custom-button">' + text + '</button>')
        .setOnClickAction(CardService.newAction()
            .setFunctionName(actionFunctionName));
}

// Function to navigate to the schedule meeting page
function navigateToSchedulePage() {
    var card = createScheduleMeetingCard();
    return CardService.newNavigation()
        .pushCard(card);
}

// Function to navigate to the availability page
function availabilityAction() {
    var avlcard = showAvailabilityPage(true);
    return CardService.newNavigation()
        .pushCard(avlcard);
}
