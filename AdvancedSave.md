# Advanced example of updating afas

In some cases, you want to **add** a sub-entity within an existing main-entity.

For example, you want to add a Contact to an existing Organisation.



The problems is :
- No `KnContact` UpdateConnector exists. 
  - The `KnContact` only exists as a sub entity of a `KnOrganisation`.
- You cannot use `SaveAsync` method on the `KnOrganisation` , because this will try to add a complete new organisation. 
- You cannot use `UpdateAsync` method on the `KnOrgnisation` , because this indicates a change in the organisation itself, but not an addition of one of the childs.

The solutions is that you need to perform an `SaveAasync (someobject, subpath)`. In this case, the `subpath` parameter indicates which element is going to be added.
 
The code example is: 

``` cs 
//We want to add an department to an existing organisation. 
//We need to start with KnOrganisation, and desribe how we want to identify the organisation.
var org = new KnOrganisation();
org.MatchOga = "0"; //match by BcCo
org.BcCo = "1000001";

//Create a new contact
var contact = new KnContact();
contact.ViKc = "AFD"; // department code
contact.ExAd = "Finance department"
contact.EmAd = "finance@somecompany.ext"
contact.ViMd = "EMA";    //Set default communication preference is mail. 
    
org.AddKnContact(kn);

//We specify KnContact in the SaveAsync method.
var result = await afasConn.SaveAsync(res, "KnContact");
                    
```
