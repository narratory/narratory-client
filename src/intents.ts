import { SystemEntity } from './interfaces'

export const dateTime : SystemEntity = {"category":"Date and Time","name":"sys.date-time","description":"Matches date, time, intervals or date and time together","returns":"String in ISO-8601 format <br>or <br>Object: Strings in<br>ISO-8601 format","default":"2:30 pm<br>13 July<br>April<br>morning<br>tomorrow at 4:30 pm<br>tomorrow afternoon"}

export const date : SystemEntity = {"category":"Date and Time","name":"sys.date","description":"Matches a date","returns":"String in ISO-8601 format","default":"tomorrow"}

export const datePeriod : SystemEntity = {"category":"Date and Time","name":"sys.date-period","description":"Matches a date interval","returns":"Object: Strings in<br>ISO-8601 format","default":"April"}

export const time : SystemEntity = {"category":"Date and Time","name":"sys.time","description":"Matches a time","returns":"String in ISO-8601 format","default":"4:30 PM"}

export const timePeriod : SystemEntity = {"category":"Date and Time","name":"sys.time-period","description":"Matches a time interval","returns":"Object: Strings in<br>ISO-8601 format","default":"afternoon"}

export const number : SystemEntity = {"category":"Numbers","name":"sys.number","description":"Ordinal and cardinal numbers","returns":"Number","default":"one"}

export const cardinal : SystemEntity = {"category":"Numbers","name":"sys.cardinal","description":"Cardinal numbers","returns":"Number","default":"ten"}

export const ordinal : SystemEntity = {"category":"Numbers","name":"sys.ordinal","description":"Ordinal numbers","returns":"Number","default":"tenth"}

export const numberInteger : SystemEntity = {"category":"Numbers","name":"sys.number-integer","description":"Matches integers only","returns":"Number","default":"12"}

export const numberSequence : SystemEntity = {"category":"Numbers","name":"sys.number-sequence","description":"Matches number sequences","returns":"String","default":"1 2 2003"}

export const flightNumber : SystemEntity = {"category":"Numbers","name":"sys.flight-number","description":"Alphanumeric flight numbers","returns":"String","default":"LH4234"}

export const unitArea : SystemEntity = {"category":"Amounts with Units","name":"sys.unit-area","description":"Number + units of area","returns":"Object: amount integer + <br>unit String","default":"ten square feet"}

export const unitCurrency : SystemEntity = {"category":"Amounts with Units","name":"sys.unit-currency","description":"Number + currency name","returns":"Object: amount integer + <br>currency String in <br>ISO 4217 format","default":"5 dollars<br>25 pounds"}

export const unitLength : SystemEntity = {"category":"Amounts with Units","name":"sys.unit-length","description":"Number + units of length","returns":"Object: amount integer + <br>unit String","default":"ten meters"}

export const unitSpeed : SystemEntity = {"category":"Amounts with Units","name":"sys.unit-speed","description":"Number + units of speed","returns":"Object: amount integer + <br>unit String","default":"5 km/h"}

export const unitVolume : SystemEntity = {"category":"Amounts with Units","name":"sys.unit-volume","description":"Number + units of volume","returns":"Object: amount integer + <br>unit String","default":"2 liters"}

export const unitWeight : SystemEntity = {"category":"Amounts with Units","name":"sys.unit-weight","description":"Number + units of weight","returns":"Object: amount integer + <br>unit String","default":"5 kilos"}

export const unitInformation : SystemEntity = {"category":"Amounts with Units","name":"sys.unit-information","description":"Number + unit of information","returns":"Object: amount integer + <br>unit String","default":"250 megabytes"}

export const percentage : SystemEntity = {"category":"Amounts with Units","name":"sys.percentage","description":"Number + percents","returns":"String","default":"50%<br>25 percent"}

export const temperature : SystemEntity = {"category":"Amounts with Units","name":"sys.temperature","description":"Number + temperature units","returns":"Object: amount integer + <br>unit String","default":"<br>25°F<br>25 degrees"}

export const duration : SystemEntity = {"category":"Amounts with Units","name":"sys.duration","description":"Number + duration units (hours, days, months etc.)","returns":"Object: amount integer + <br>unit String","default":"10 minutes<br>5 days"}

export const age : SystemEntity = {"category":"Amounts with Units","name":"sys.age","description":"Number + age units (years old, months old etc.)","returns":"Object: amount integer + <br>unit String","default":"5 y.o.<br>10 months old"}

export const currencyName : SystemEntity = {"category":"Unit Names","name":"sys.currency-name","description":"Currencies","returns":"String in <br>ISO 4217 format","default":"dollars<br>pounds"}

export const unitAreaName : SystemEntity = {"category":"Unit Names","name":"sys.unit-area-name","description":"Units of area","returns":"String","default":"square meters"}

export const unitLengthName : SystemEntity = {"category":"Unit Names","name":"sys.unit-length-name","description":"Units of length","returns":"String","default":"meters"}

export const unitSpeedName : SystemEntity = {"category":"Unit Names","name":"sys.unit-speed-name","description":"Units of speed","returns":"String","default":"kilometer per hour"}

export const unitVolumeName : SystemEntity = {"category":"Unit Names","name":"sys.unit-volume-name","description":"Units of volume","returns":"String","default":"cubic meters"}

export const unitWeightName : SystemEntity = {"category":"Unit Names","name":"sys.unit-weight-name","description":"Units of weight","returns":"String","default":"kilograms"}

export const unitInformationName : SystemEntity = {"category":"Unit Names","name":"sys.unit-information-name","description":"Units of information","returns":"String","default":"megabytes"}

export const address : SystemEntity = {"category":"Geography","name":"sys.address","description":"United Sates, Great Britain full address","returns":"String of user input","default":"1600 Amphitheatre Pkwy, Mountain View, CA 94043"}

export const zipCode : SystemEntity = {"category":"Geography","name":"sys.zip-code","description":"United States,<br>Great Britain,<br>Canada postal codes","returns":"String","default":"94122<br>SW1P 3PA<br>H3B 4W2"}

export const geoCapital : SystemEntity = {"category":"Geography","name":"sys.geo-capital","description":"World capitals","returns":"String in English","default":"Paris<br>Rome"}

export const geoCountry : SystemEntity = {"category":"Geography","name":"sys.geo-country","description":"Short and full names of country","returns":"String in English","default":"United States<br>Great Britain"}

export const geoCountryCode : SystemEntity = {"category":"Geography","name":"sys.geo-country-code","description":"Short and full country names, alpha-2, alpha-3 and numeric codes as per <br>ISO 3166-1","returns":"object: Strings for name, <br>alpha-2 and alpha-3 codes, <br>integer for numeric code <br>as per ISO 3166-1","default":"United Sates<br>US<br>USA<br>840"}

export const geoCity : SystemEntity = {"category":"Geography","name":"sys.geo-city","description":"Major cities","returns":"String in English","default":"New York<br>Paris"}

export const geoState : SystemEntity = {"category":"Geography","name":"sys.geo-state","description":"Major states in GB, USA, India, Canada, Australia.","returns":"String in English","default":"CA<br>Scotland"}

export const placeAttraction : SystemEntity = {"category":"Geography","name":"sys.place-attraction","description":"Top tourist attractions","returns":"String in English","default":"Golden Gate Bridge<br>Buckingham Palace"}

export const airport : SystemEntity = {"category":"Geography","name":"sys.airport","description":"Airport names, IATA and ICAO codes","returns":"Object: Strings for country, <br>city of the airport, its name <br>and its IATA/ICAO codes","default":"Heathrow Airport<br>SFO<br>KSFO"}

export const location : SystemEntity = {"category":"Geography","name":"sys.location","description":"General entity to refer to any location: full addresses, street names, zip codes, cities, countries, POI, airport names etc.","returns":"Object with the following<br>possible fields:<br>admin-area<br>business-name<br>city<br>country<br>island<br>shortcut<br>street-address<br>subadmin-area<br>zip-code","default":"1600 Amphitheatre Pkwy, Mountain View, CA 94043"}

export const email : SystemEntity = {"category":"Contacts","name":"sys.email","description":"email","returns":"String","default":"user@example.com<br>example at gmail dot com"}

export const phoneNumber : SystemEntity = {"category":"Contacts","name":"sys.phone-number","description":"Phone number","returns":"String of phone number<br>(spaces, dashes and <br>parentheses are omitted)","default":"(123) 456 7890<br>+1 (123) 456-7890"}

export const givenName : SystemEntity = {"category":"Names","name":"sys.given-name","description":"<span style=\"color:red\">Deprecated</span>: Use @sys.person instead.<br>Common given names","returns":"String","default":"John<br>Mary"}

export const lastName : SystemEntity = {"category":"Names","name":"sys.last-name","description":"<span style=\"color:red\">Deprecated</span>: Use @sys.person instead.<br>Common last names","returns":"String","default":"Smith<br>Adams"}

export const person : SystemEntity = {"category":"Names","name":"sys.person","description":"Common given names, last names or their combinations","returns":"Object: name string","default":"Mary Smith<br>Mary<br>Smith"}

export const musicArtist : SystemEntity = {"category":"Music","name":"sys.music-artist","description":"Matches an artist / group name","returns":"String","default":"Beatles<br>RHCP"}

export const musicGenre : SystemEntity = {"category":"Music","name":"sys.music-genre","description":"Matches a genre name","returns":"String","default":"Blues"}

export const color : SystemEntity = {"category":"Other","name":"sys.color","description":"Words describing colors","returns":"String","default":"green<br>magenta"}

export const language : SystemEntity = {"category":"Other","name":"sys.language","description":"Language names","returns":"String","default":"English<br>Japanese"}

export const any : SystemEntity = {"category":"Generic","name":"sys.any","description":"Matches any non-empty input","returns":"String of user input","default":"flower"}

export const url : SystemEntity = {"category":"Generic","name":"sys.url","description":"Matches a url","returns":"String","default":"www.dialogflow.com"}

