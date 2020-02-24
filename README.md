[![nuget badge](https://img.shields.io/nuget/v/DutchGrit.AfasClient.svg)](https://www.nuget.org/packages/DutchGrit.AfasClient/)

# Afas Client
The AfasClient (.NET Standard 2.0 library) samples and T4 templates using the Afas REST API.

This repository contains the documentation and code samples how to use the AfasClient library NuGet package listed as `DutchGrit.AfasClient`. 


## Getting started

1. Make sure you have a appconnector in Afas. Read the [Setup a AppConnector](SetupAppConnector.MD).  
2. Include the NuGet package. 
3. Included the T4 Templates in your project. See [Include Templates](IncludeTemplates.MD) for instructions.
4. Happy coding!  

## Code samples

### Setup the client object

```cs
var client = new AfasClient(00000, "YOUR FULL TOKEN KEY");
```



Getting data from Afas is easy:

```cs
    var invoice = await client.Query<ProfitDebtorInvoices>()
                .WhereEquals(x => x.InvoiceNr, "150001")
                .GetAsync();
```

Update 

