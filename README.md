[![nuget badge](https://img.shields.io/nuget/v/DutchGrit.AfasClient.svg)](https://www.nuget.org/packages/DutchGrit.AfasClient/)

# Afas Client
The AfasClient (.NET Standard 2.0 library) samples and T4 templates using the Afas REST API.

This repository contains the documentation and code samples how to use the AfasClient library NuGet package listed as `DutchGrit.AfasClient`. 


## Getting started

1. Make sure you have an AppConnector in Afas. Read the [Setup a AppConnector](SetupAppConnector.MD).  
2. Include the AfasClient NuGet package to your project.
3. Included the T4 Templates in your project. See [Include Templates](IncludeTemplates.MD) for instructions.
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

### Afas version information

```cs
var version = await client.GetVersionAsync();
```
> Most of the provided methods come in both sync and async version. For example: `GetVersionAsync()` and `GetVersion()`.

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

In the above code snippet, the `ProfitDebtorInvoices` is a generated class by the `GetConnectors.tt`. The class only exists if the corresponding GetConnector was included in your AppConnector definition.

It is possible to include one or more `Where*` clausules which will act as a AND filter. In this example, the `WhereContains` has multiple values specified which acts as an OR. Both the `Skip` and `Take` are included. You can retrieve all available records by specifying `Take(-1)`.  Sorting the result is done by `OrderBy` and `OrderByDesc` statements.  

The `WhereEquals` and `WhereContains` are only some samples of the complete filter options. Please see [Filter overview](QueryFilters.md) for more filters. 


### Update data in Afas

