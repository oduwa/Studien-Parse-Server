import json,httplib
connection = httplib.HTTPSConnection('studien-server.herokuapp.com/parse', 443)
connection.connect()
connection.request('GET', '/1/classes/Subject', '', {
       "X-Parse-Application-Id": "cWXjlwyKH3BwBbxFjhun4IJAlOhrU5PuoURXSmFT",
       "X-Parse-REST-API-Key": "gBnGei76iDjgKDE8Aq5LWYJTADZpZW8bf7fcQkpm"
     })
result = json.loads(connection.getresponse().read())
print result

curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{}' \
  https://animehub-server.herokuapp.com/parse/functions/hello

curl -X GET \
  -H "X-Parse-Application-Id: cWXjlwyKH3BwBbxFjhun4IJAlOhrU5PuoURXSmFT" \
  -H "X-Parse-REST-API-Key: gBnGei76iDjgKDE8Aq5LWYJTADZpZW8bf7fcQkpm" \
  https://studien-server.herokuapp.com/classes/Subject
