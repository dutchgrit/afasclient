using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;

namespace DutchGrit.Afas
{
    public static class Tracer
    {
        public static TraceSource Instance = new TraceSource("DutchGrit.Afas");
    }
}
