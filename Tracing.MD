# Tracing the http requests and response

In version 1.0.0.62 we provide a System.Diagnostic.TraceSource which records the actual http requests and response.
The TraceSource instance is provided at Tracer.Instance 

The 'quick n dirty' method to get a trace is:

``` cs
 using DutchGrit.Afas;
 
 //Turn on all levels (debug, warning, verbose, information, etc)
 Tracer.Instance.Switch.Level = SourceLevels.All;
 
 //The TraceSource has a default listener, which reports the trace output in the visual studio "debug output" view.
 //Optional: you can also save the trace to a file. 
 Tracer.Instance.Listeners.Add(new TextWriterTraceListener("c:\\temp\\trace.log"));
```

If you use the ILogger framework in .NET Core (Microsoft.Extensions.Logging), please google for the .AddTraceSource extensions.
Examples are welcome 😄


