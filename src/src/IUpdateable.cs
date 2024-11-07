using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas
{
    /// <summary>
    /// Placeholder interface to indicate that a specific IEntity has a corresponding UpdateConnector.
    /// Example : KnOrganisation is IUpdateable because it has an UpdateConnector
    ///         : KnBankAccount is NOT updateable because it is part as a object within another IEntity.
    /// </summary>
    public interface IUpdateable<TResult> : IUpdateEntity
    {
        
    }

    public interface IResult<TResult>
    {
        TResult Result { get; }
    }

}
