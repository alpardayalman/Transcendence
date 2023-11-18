# Transcendence

[![-----------------------------------------------------](
https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](https://github.com/alpardayalman?tab=repositories)

### First Part ###

[![-----------------------------------------------------](
https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](https://github.com/alpardayalman?tab=repositories)

### Technical Requirements ###

If you choose to include a backend, it must be written in pure Ruby . However,
this requirement can be overridden by the Framework module.

If your backend or framework uses a database, you must follow the constraints
of the Database module.

The frontend should be developed using pure vanilla Javascript . However, this
requirement can be altered through the FrontEnd module.

Your website must be a single-page application. The user should be able to use the
Back and Forward buttons of the browser.

Your website must be compatible with the latest stable up-to-date version of
Google Chrome.

The user should encounter no unhandled errors and no warnings when browsing the
website.

Everything must be launched with a single command line to run an autonomous
container provided by Docker . Example : docker-compose up --build

### Pong ###

The main purpose of this website is to play Pong versus other players.

Therefore, users must have the ability to participate in a live Pong game against
another player directly on the website. Both players will use the same keyboard.
The Remote players module can enhance this functionality with remote players.

A player must be able to play against another player, but it should also be possible
to propose a tournament. This tournament will consist of multiple players who
can take turns playing against each other. You have flexibility in how you implement
the tournament, but it must clearly display who is playing against whom and the
order of the players.

A registration system is required: at the start of a tournament, each player
must input their alias name. The aliases will be reset when a new tournament
begins. However, this requirement can be modified using the Standard User
Management module.

There must be a matchmaking system: the tournament system organize the
matchmaking of the participants, and announce the next fight.

All players must adhere to the same rules, which includes having identical paddle
speed. This requirement also applies when using AI; the AI must exhibit the same
speed as a regular player.

The game itself must be developed in accordance with the default frontend con-
straints (as outlined above), or you may choose to utilize the FrontEnd module,
or you have the option to override it with the Graphics module. While the visual
aesthetics can vary, it must still capture the essence of the original Pong (1972).

### Security concerns ###

In order to create a basic functional website, here are a few security concerns that you
have to tackle:

Any password stored in your database, if applicable, must be hashed.

Your website must be protected against SQL injections/XSS.

If you have a backend or any other features, it is mandatory to enable an HTTPS
connection for all aspects (Utilize wss instead of ws...).

You must implement some form of validation for forms and any user input, either
within the base page if no backend is used or on the server side if a backend is
employed.



### Second Part ###

# WEB #
Major module: Use a Framework as backend.
Minor module: Use a front-end framework or toolkit.
Minor module: Use a database for the backend.


# User Management #
Major module: Standard user management, authentication, users across tournaments.
Major module: Implementing a remote authentication.


# Gameplay and user Experience #
Major module: Remote players.
Major module: Add Another Game with User History and Matchmaking.
Minor module: Game Customization Options.
Major module: Live chat.


# IA - Algo #
Major module: Introduce an AI Opponent.


# Cybersecurity #
Major module: Implement Two-Factor Authentication (2FA) and JWT.


# Graphics #
Major module: Use of advanced 3D techniques.

# Accessibility #
Minor module: Support on all devices.
Minor module: Expanding Browser Compatibility.
Minor module: Multiple language supports.
Minor module: Add accessibility for Visually Impaired Users.
