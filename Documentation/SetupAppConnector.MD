# Setup an AppConnector in Afas for your project

An AppConnector in Afas defines the set of GetConnectors and UpdateConnectors you want to use in your application.

> Note. This setup is listed here for your convenience. But the official documentation is listed on [help.afas.nl](https://help.afas.nl).

1. Define an appconnector

Follow the menu path `\Algemeen \Beheer \App Connector` to add a new AppConnector. Make sure it is unblocked.  

![AppConnectorScreen](Images/DefinitionAppConnector.png)

2. Include the get and update connectors

Proceed to the tabs : `GetConnectoren` and `UpdateConnectoren` to select all the connectors you need in your project. 

3. Get your token

Proceed to the tab: `Gebruikerstoken` to  generate your token directly.

![GetAPIToken](Images/GetAPIToken.png)

As alternative: You can also request a token with the `afas-cli` tool, or with the `DutchGrit.AfasClient` library. In these two situations, you need the API key and Environment key asi shown in the image at bullet 1.