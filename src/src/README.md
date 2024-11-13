#AfasClient 

The documentation of the 'normal' AfasClient documentation is available on https://github.com/dutchgrit/afasclient .

The Refinery client is a reversed-enginereerd client on the endpoint used by afas pocket. 
The advantage of the refinery endpoint is that you don't need a per-customer setup of AppConnector (with the correct GetConnectors and UpdateConnectors), you can use one general endpoint for all customers. 
The disadvantage is that you can only request information which is available for pocket, no custom connectors. 

Reverse enginering is done by analyzing : 
https://pocketdemo-latest.azurewebsites.net/#/menu/home

Or by analyzing the code of the app 
- download Pocket APK android
- extract APK 
- look for the www folder
- deobfuscate the js files.


