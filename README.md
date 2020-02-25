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

By default, the client will use the Production environment of Afas. You can also specify to use the Test or Production environments by initializing the AfasClient object with a different value.

```cs
var testclient = new AfasClient(00000, "YOUR FULL TOKEN KEY", Environments.Test);
```


### Client information

You can ask for the current Afas version.

```cs
//async method
var version1 = await client.GetVersionAsync();
//sync method
var version2 = client.GetVersion();
```

You can also get detailed information about the current connection.

```cs
//async method
var version1 = await client.GetVersionAsync();
``` 


### Quering data from Afas  

A sample query.

```cs
var invoice = await client.Query<ProfitDebtorInvoices>()
        .WhereEquals(x => x.InvoiceNr, "150001")
        .GetAsync();
```

In the above code snippet, the `ProfitDebtorInvoices` is a generated class by the `GetConnectors.tt`. It exists only if you included the `ProfitDebtorInvoices` GetConnector in your AppConnector definition.
 
`WhereEquals` is one of the where filter options. 


| Filter 		| Values |
| --------------------- | ------:|
| `WhereEquals`		| multiple
| `WhereGreaterOrEqual`   | single
| `WhereLessOrEqual`	| single
| `WhereGreaterThen`	| single
| `WhereLessThen`		| single
| `WhereContains`		| multiple
| `WhereNotContains`	| multiple
| `WhereIsNull`	 	| none
| `WhereIsNotNull`	| none
| `WhereStartsWith`	| multiple
| `WhereNotStartsWith`	| multiple
| `WhereEndsWith`		| multiple
| `WhereNotEndsWith`	| multiple

**single** means that only one value is supported. **multiple** allows for more then one value, for example: `WhereContains(x=>x.Code, "ABC","DEF")` . In this case the supplied values are intepretted as an `OR` statement, meaning either `x.Code` must be valid for `ABC` *or* `DEF`.


> Note that full LINQ is NOT supported. The `WhereSomething` methods only facilitate field selections with a lambda expression `x=>x.FieldName`. 



Update 

