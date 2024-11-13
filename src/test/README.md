# Test Documentation
 To properly test the AfasClient library, you need a couple things:
 - Inside the config:
   - Valid AFAS token (format: `<token>...<token>`)
   - Valid member number (5 digits)
   - Valid environment (0 - 2, parsed to `DutchGrit.Environments` enum)
 - GetConnectors and UpdateConnectors that can be used by anyone (AFAS has a few built-in connectors that are used for this purpose inside `AfasClient.Tests` already)

## Local Testing
To test locally, fill in the `appsettings.json` configuration with your own valid variables. If the credentials are valid, the AfasClient should be able to test using your given AppConnector locally.

## CI/CD Testing
Pipeline Testing is done using an AppConnector inside Lucrasoft's AFAS test environment. The credentials of this AppConnector are held within GitHub Secrets, which get accessed in the pipeline for automatic testing. The AppConnector used contains these connectors:
- Profit VAT Code (built-in AFAS GetConnector)
- FbItemArticle (built-in AFAS UpdateConnector)
- AppConnectorVersion (built-in AFAS custom connector)
- Test Environment (`DutchGrit.Environments.Test` = 1)

> [!WARNING]
> Make sure that you include the custom connector `AppConnectorVersion` within your tested AppConnector (if you test your own locally) before you test. Not including this connector will make the `GetVersion()` and `GetVersionAsync()` tests fail as they need this to be included. If you do not include this, keep in mind that these tests will fail. 
