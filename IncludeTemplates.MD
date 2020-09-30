> The use of T4 templates is deprecated. Please consider using the [Afas CommandLine tool](https://github.com/dutchgrit/afascli) to generate the typed C# classes.

#  Include templates (deprecated)

Before the AfasClient can work, you need to generate the Get- and UpdateConnectors code which is specific to your App Connector setup. See [Setup App Connector](SetupAppConnector.MD) for instructions. 

1. NuGet package

Make sure your project included the NuGet package.

2. Include the Templates folder in your project.

In this Github repository you can find the 3 required files in the Templates folder.
- `GetConnectors.tt` a T4 template to generate the GetConnector classes.
- `UpdateConnectors.tt` a T4 template to generate the UpdateConnector classes.
- `config.ttinclude` a configuration file

3. Update the `config.ttinclude` file

Specify your Afas Member and Token. 
This is used by the templates to query the Afas API about the used Get- and UpdateConnector.
You will find code:

```cs
   var memberid = 00000;
   var token = "<token><version>1</version><data>PUT-YOUR-TOKEN-HERE</data></token>";  
```

