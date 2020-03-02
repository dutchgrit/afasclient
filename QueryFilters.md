# AfasClient Query filters

The AfasClient library supports all filter options available in the Afas REST API.



```cs
var invoices = await client.Query<ProfitDebtorInvoices>()
        .WhereEquals(x => x.UnitId, "1")
        .WhereContains(x => x.Description, "ABC", "BCD", "CDE")
```

Some filters support multiple values (OR-like). The list below specifies how many values can be supplied.


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

**single** means that only one value is supported. **multiple** allows for more then one value, for example: `WhereContains(x=>x.Description, "ABC","DEF")` . In this case the supplied values are intepretted as an `OR` statement, meaning either `x.Code` must be valid for `ABC` *or* `DEF`.


> Note that full LINQ is NOT supported. The `WhereSomething` methods only facilitate field selections with a lambda expression `x=>x.FieldName`. 
