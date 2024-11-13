[![nuget badge](https://img.shields.io/nuget/v/DutchGrit.AfasClient.svg)](https://www.nuget.org/packages/DutchGrit.AfasClient/)

# Afas Client
The GitHub repository for the open-source DutchGrit.AfasClient library, a .NET Standard 2.0 library for the Afas REST API.

This repository contains the source code, documentation and some code samples on how to use the AfasClient library NuGet package listed as `DutchGrit.AfasClient`. 


## Getting started

1. Make sure you have an AppConnector in Afas. Read the [Setup a AppConnector](Documentation/SetupAppConnector.MD).  
2. Include the [DutchGrit.AfasClient](https://www.nuget.org/packages/DutchGrit.AfasClient/) NuGet package to your project.
3. Generate your AppConnector specific GetConnector and UpdateConnector code with the [afas-cli](https://github.com/dutchgrit/afascli) tool.
4. Happy coding!  

## Code snippets

### Setup the client object

```cs
var client = new AfasClient(00000, "YOUR FULL TOKEN KEY");
```

By default, the client will use the Production environment of Afas. You can also specify to use the Test (`Environments.Test`) or Acceptation (`Environments.Acceptation`) environments by initializing the AfasClient object with a different value.

```cs
var client = new AfasClient(00000, "YOUR FULL TOKEN KEY", Environments.Test);
```

### Session information

```cs
var session = await client.GetSessionInfoAsync();
Console.WriteLine($"ConnectorName: {session.Info.ApplicationName}");
Console.WriteLine($"EnvironmentID: {session.Info.EnvironmentID}");
Console.WriteLine($"Group        : {session.Info.Group}");
``` 

The session also holds the availabe Get- and UpdateConnectors as specified in the AppConnector.

```cs
            foreach (var conn in session.GetConnectors)
            {
                Console.WriteLine($"{conn.Id} - {conn.Description}");
            }

```

### Quering data from Afas  

The AfasClient library's make it easier to use the Afas GetConnectors by providing typed results from a LINQ-like Query's. 

```cs
var invoices = await client.Query<ProfitDebtorInvoices>()
        .WhereEquals(x => x.UnitId, "1")
        .WhereContains(x => x.Description, "ABC", "BCD", "CDE")
        .Skip(50)
        .Take(10)
        .OrderBy(x => x.DebtorID)
        .GetAsync();
```

In the above code snippet, the `ProfitDebtorInvoices` is a generated class by the `afas-cli`. The class only exists if the corresponding GetConnector was included in your AppConnector definition.

It is possible to include one or more `Where*` clausules which will act as a AND filter. In this example, the `WhereContains` has multiple values specified which acts as an OR. Both the `Skip` and `Take` are included. You can retrieve all available records by specifying `Take(-1)`.  Sorting the result is done by `OrderBy` and `OrderByDesc` statements.  

The `WhereEquals` and `WhereContains` are only some samples of the complete filter options. Please see [Filter overview](Documentation/QueryFilters.md) for more filters. 


### Update data in Afas

To update data in Afas, you will need one of the UpdateConnectors and include it in your AppConnector. The `afas-cli` tool will generate the classes you need to update your data. 

The page [UpdateConnectors](https://help.afas.nl/help/NL/SE/App_Conect_UpdDsc.htm) on the [help.afas.nl](https://help.afas.nl) website, shows an overview of all available updateconnectors.

The `session.UpdateConnectors` gives an overview of all the installed updateconnectors.

An example how to add a new organisation in Afas with the AfasClient library, assuming you have included the `KnOrganisation` UpdateConnector in your AppConnector.



```cs
var org = new KnOrganisation()
    {
        AutoNum = false,
        BcCo = "1001",
        Nm = "Test Organisation",   //Name
        SeNm = "TEST"              //Search name
        ,...
    };

var ba = new KnBankAccount()
    { 
        //etc..etc..
    };
            
org.AddKnBankAccount(ba);

//save this object to afas
var res = await client.SaveAsync(org);

//check result
if (res.IsSuccess) {
    //get the result object, could be a typed 
    //class or simply object
    var x = res.Result;
}
```

The `client.SaveAsync(someobject)` will result in a http `POST` call and `client.UpdateAsync(someobject)` will result in a `PUT` call, which roughly corresponds to ADD and UPDATE operations. 

To add/update a sub-parts of an object, please read the [Advanced save](Documentation/AdvancedSave.md) documentation.


### Other functions

The AppConnectors can also be configured with special connectors, like: version, subject and report connectors.

#### VersionConnector

You need the AppConnectorVersion 'connector' in your AppConnector defintion to use these methods. Please see the [setup](Documentation/SetupAppConnector.md) instructions.

```cs
var version = await client.GetVersionAsync();
```
> TIP: Most of the provided methods come in both sync and async version. For example: `GetVersionAsync()` and `GetVersion()`.

#### FileConnector

``` cs 
var fileInfo = await client.GetFileAsync("..FileId..","invoice001.pdf");

//GetFile returns null if not found. 
if (file!=null) 
 {
     //convert Base46 to bytes
     var rawbytes = Convert.FromBase64String(fileInfo.FileDataBase64);
     //save to disk
     System.IO.File.WriteAllBytes(fileInfo.FileName, rawbytes);
 }
```

#### ImageConnector

Sample usage of the imageConnector. 

``` cs

//request image with id 10001
var imageInfo = await client.GetImageAsync(10001, ImageSizes.Medium);

//info object holds 
if (imageInfo.IsNotFound) { ... }

if (imageInfo.MimeType == 'image/jpg') { ... }

var rawbytes = Convert.FromBase64String(imageInfo.FileDataBase64);

```

#### Other connectors

The other connectors are not implemented (yet). 
Please leave a request if you need the `Report` connector.  

### OTP Client

When developing afas application, you can choose to work with ONE token for the whole application, or per-user token. 
The per-user token scenario requires a way to request tokens with the OTP client. 

To request a token you need:
- API key and Environment key of the AppConnector.
- The users emailadress or 

The process requires two steps
#### OTP request and validate process

``` cs
var otpclient  = new AfasOtpClient( 12345, "api-key", "environment-key" );

//Request the otp valdiation code, which is send by mail by Afas.
await otpclient.GetOtpTokenRequest("john@somecompany.ext"); 

//Assume you received validation code 123456 by mail, you can request a token. 
var token = await otpclient.GetOtpTokenValidation("john@somecompany.ext", "123456";)

``` 

### Debugging
See the [tracing](Documentation/Tracing.MD) option for monitoring and debugging the actual requests performed.
Feel free to report any bugs or missing features.

### Got feedback or ideas?
[File an issue](https://github.com/dutchgrit/afasclient/issues) and tell us what you want to change, add, or what doesn't work for you if that's the case. All issues are welcome, from improvements to bugs!

### Want to contribute?
If you want to contribute to the AfasClient project, a great place to start would be the project's 'Issues' tab! You can also contribute by creating bug reports, try playing around with the client and see if you find any problems. If so, make an issue!
