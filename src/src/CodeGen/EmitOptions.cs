using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.CodeGen
{
    /// <summary>
    /// Specify options used during code generation of the GetConnectors and UpdateConnectors
    /// </summary>
    public class EmitOptions
    {

        /// <summary>
        /// The default namespace to include in the code generation.
        /// Default value is: DutchGrit.Afas.Entities
        /// </summary>
        public string NameSpace { get; set; }

        /// <summary>
        /// If public or internal classes are emitted.
        /// Default value is: true
        /// </summary>
        public bool UsePublicClass { get; set; }



        internal string GetClassAccessModifier { get
            {
                return UsePublicClass ? "public" : "internal";
            } 
        }

        public EmitOptions()
        {
            this.UsePublicClass = true;
            this.NameSpace = "DutchGrit.Afas.Entities";
        }

    }
}
